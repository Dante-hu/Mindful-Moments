from dotenv import load_dotenv
import os
import random
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv(dotenv_path="../frontend/.env.local")
origins = ["http://localhost:3000", "https://your-app.vercel.app"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize emotion analyzer
emotion_analyzer = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SQLite setup
DATABASE_URL = "sqlite:///mindful_moments.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Mood(Base):
    __tablename__ = "moods"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood_text = Column(String)
    emotion = Column(String)  # Changed from sentiment
    feedback = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class MoodCreate(BaseModel):
    mood_text: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Feedback mapping for dynamic responses
feedback_map = {
    "joy": [
        "That’s wonderful to hear! Keep the positivity flowing with a gratitude journal.",
        "Love your joyful vibe! Try sharing a kind word with someone today.",
        "You’re radiating happiness! How about a quick mindfulness moment to savor it?"
    ],
    "sadness": [
        "It’s okay to feel down. Try a 5-minute breathing exercise: Inhale for 4, hold for 4, exhale for 4.",
        "We’re here for you. Write down one thing you’re grateful for to lift your spirits.",
        "Feeling blue? Try listening to your favorite uplifting song."
    ],
    "anger": [
        "Feeling frustrated? Take a moment to breathe deeply and release tension.",
        "It’s okay to feel angry. Try a quick walk to clear your mind.",
        "Anger can be tough. How about journaling what’s on your mind to let it out?"
    ],
    "fear": [
        "Feeling stressed or anxious? Try a grounding technique: name 5 things you see around you.",
        "It’s okay to feel uneasy. Take slow, deep breaths to calm your mind.",
        "Sounds like you’re worried. Try a 1-minute meditation to center yourself."
    ],
    "surprise": [
        "Wow, that’s unexpected! Take a moment to reflect on this feeling in a journal.",
        "Surprised? Let’s channel that energy into something creative!",
        "That’s an exciting moment! How about capturing it with a quick note?"
    ],
    "disgust": [
        "Feeling unsettled? Take a deep breath and focus on something positive.",
        "It’s okay to feel this way. Try a quick mindfulness exercise to reset.",
        "That sounds tough. How about stepping away for a moment to clear your mind?"
    ]
}

# Distress detection
distress_keywords = ["hopeless", "crisis", "hurt myself", "desperate", "can’t go on","kill"]

# API endpoints
@app.get("/")
async def home():
    return {"message": "Welcome to Mindful Moments Backend!"}

@app.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/log-mood")
async def log_mood(mood: MoodCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check for distress keywords
    if any(keyword in mood.mood_text.lower() for keyword in distress_keywords):
        feedback = (
            "It sounds like you’re going through a tough time. Please consider reaching out to a trusted friend or a helpline "
            "(e.g., 988 in the US or your local crisis line). This app is not a substitute for professional help."
        )
        emotion = "distress"
    else:
        result = emotion_analyzer(mood.mood_text)[0]
        emotion = result["label"]
        # Map nuanced states (optional, based on confidence scores or keywords)
        if emotion == "fear" and "stress" in mood.mood_text.lower():
            emotion = "stress"
        elif emotion == "sadness" and "overwhelm" in mood.mood_text.lower():
            emotion = "overwhelmed"
        feedback = random.choice(feedback_map.get(emotion, ["Thanks for sharing! Try a journaling prompt."]))
    
    db_mood = Mood(
        mood_text=mood.mood_text,
        user_id=current_user.id,
        emotion=emotion,
        feedback=feedback
    )
    db.add(db_mood)
    db.commit()
    
    # Basic personalization: Check recent moods for patterns
    recent_moods = db.query(Mood).filter(Mood.user_id == current_user.id).order_by(Mood.timestamp.desc()).limit(5).all()
    if len(recent_moods) >= 3 and all(m.emotion in ["sadness", "overwhelmed", "fear", "stress", "anger", "disgust"] for m in recent_moods):
        feedback += " It seems you’ve been feeling down lately. Consider trying a favorite activity or talking to someone you trust."

    return {"message": "Mood logged successfully", "emotion": emotion, "feedback": feedback}

@app.get("/mood-history")
async def mood_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    moods = db.query(Mood).filter(Mood.user_id == current_user.id).all()
    return [{"mood_text": mood.mood_text, "emotion": mood.emotion, "feedback": mood.feedback, "timestamp": mood.timestamp} for mood in moods]

@app.post("/clear-mood-logs")
async def clear_mood_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Mood).filter(Mood.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Mood logs cleared successfully"}