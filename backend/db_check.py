from sqlalchemy import create_engine, text

engine = create_engine("sqlite:///C:/Users/dante/Mindful-Moments/backend/mindful_moments.db")
with engine.connect() as conn:
    users = conn.execute(text("SELECT * FROM users")).fetchall()
    print("Users:", users)
    moods = conn.execute(text("SELECT * FROM moods")).fetchall()
    print("Moods:", moods)