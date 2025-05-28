from dotenv import load_dotenv
import os

#loads the secret key
load_dotenv(dotenv_path="../frontend/.env.local")


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


app = FastAPI()#instance
origins = ["http://localhost:3000", "https://your-app.vercel.app"]
#allows frontend and backedn communciation
app.add_middleware(CORSMiddleware, allow_origins = origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

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
    sentiment = Column(String)  # Store sentiment (POSITIVE/NEGATIVE)
    feedback = Column(String)   # Store AI feedback
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

#Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class MoodCreate(BaseModel):
    mood_text: str

class Token(BaseModel):
    access_token: str
    token_type: str

#Dependency for database session
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
    result = sentiment_analyzer(mood.mood_text)[0]
    sentiment = result["label"]
    feedback = {
        "POSITIVE": "Great to hear you’re doing well! Try a quick mindfulness exercise.",
        "NEGATIVE": "It seems you’re feeling down. Try this breathing exercise: Inhale for 4, hold for 4, exhale for 4."
    }.get(sentiment, "Thanks for sharing! How about a journaling prompt?")
    db_mood = Mood(
        mood_text=mood.mood_text,
        user_id=current_user.id,
        sentiment=sentiment,
        feedback=feedback
    )
    db.add(db_mood)
    db.commit()
    return {"message": "Mood logged successfully", "sentiment": sentiment, "feedback": feedback}

@app.get("/mood-history")
async def mood_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    moods = db.query(Mood).filter(Mood.user_id == current_user.id).all()
    return [{"mood_text": mood.mood_text, "sentiment": mood.sentiment, "feedback": mood.feedback, "timestamp": mood.timestamp} for mood in moods]

@app.post("/clear-mood-logs")
async def clear_mood_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Mood).filter(Mood.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Mood logs cleared successfully"}