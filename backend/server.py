from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        user = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception as e:
        raise HTTPException(status_code=401, detail='Invalid token')

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChildCreate(BaseModel):
    name: str
    age: int

class Child(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    parent_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class GameSessionCreate(BaseModel):
    child_id: str
    game_type: str  # 'memory', 'puzzle', 'attention'
    score: int
    accuracy: float
    time_spent: int  # seconds
    difficulty_level: int

class GameSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    child_id: str
    game_type: str
    score: int
    accuracy: float
    time_spent: int
    difficulty_level: int
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Progress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    child_id: str
    overall_progress: float
    streak: int
    total_time: int  # total seconds
    games_played: int
    last_played: str
    avg_accuracy: float

class ReviewCreate(BaseModel):
    parent_name: str
    rating: int
    review_text: str

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    parent_name: str
    rating: int
    review_text: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Routes
@api_router.get("/")
async def root():
    return {"message": "Cognitive Training API"}

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({'email': user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    # Create user
    user = User(name=user_data.name, email=user_data.email)
    user_dict = user.model_dump()
    user_dict['password'] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    token = create_token(user.id)
    return {'token': token, 'user': user}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    token = create_token(user['id'])
    user_data = User(**user)
    return {'token': token, 'user': user_data}

@api_router.post("/children", response_model=Child)
async def add_child(child_data: ChildCreate, current_user: dict = Depends(get_current_user)):
    child = Child(name=child_data.name, age=child_data.age, parent_id=current_user['id'])
    child_dict = child.model_dump()
    await db.children.insert_one(child_dict)
    return child

@api_router.get("/children", response_model=List[Child])
async def get_children(current_user: dict = Depends(get_current_user)):
    children = await db.children.find({'parent_id': current_user['id']}, {'_id': 0}).to_list(100)
    return children

@api_router.post("/games/session", response_model=GameSession)
async def save_game_session(session_data: GameSessionCreate, current_user: dict = Depends(get_current_user)):
    # Verify child belongs to parent
    child = await db.children.find_one({'id': session_data.child_id, 'parent_id': current_user['id']})
    if not child:
        raise HTTPException(status_code=403, detail='Child not found')
    
    session = GameSession(**session_data.model_dump())
    session_dict = session.model_dump()
    await db.game_sessions.insert_one(session_dict)
    
    # Update progress using RL-inspired calculation
    await update_progress(session_data.child_id)
    
    return session

async def update_progress(child_id: str):
    # Get all sessions for this child
    sessions = await db.game_sessions.find({'child_id': child_id}, {'_id': 0}).to_list(1000)
    
    if not sessions:
        return
    
    # Calculate metrics
    total_time = sum(s['time_spent'] for s in sessions)
    games_played = len(sessions)
    avg_accuracy = sum(s['accuracy'] for s in sessions) / games_played if games_played > 0 else 0
    
    # RL-inspired progress calculation
    # Factor in: accuracy, consistency (streak), improvement over time
    recent_accuracy = sum(s['accuracy'] for s in sessions[-10:]) / min(10, len(sessions))
    improvement_factor = recent_accuracy / 100  # 0-1 scale
    
    overall_progress = min(100, (games_played * 2) + (avg_accuracy * 0.5) + (improvement_factor * 20))
    
    # Calculate streak (consecutive days played)
    streak = calculate_streak(sessions)
    
    progress = {
        'child_id': child_id,
        'overall_progress': round(overall_progress, 2),
        'streak': streak,
        'total_time': total_time,
        'games_played': games_played,
        'last_played': sessions[-1]['timestamp'],
        'avg_accuracy': round(avg_accuracy, 2)
    }
    
    await db.progress.update_one(
        {'child_id': child_id},
        {'$set': progress},
        upsert=True
    )

def calculate_streak(sessions):
    if not sessions:
        return 0
    
    # Sort by timestamp
    sorted_sessions = sorted(sessions, key=lambda x: x['timestamp'], reverse=True)
    
    streak = 1
    last_date = datetime.fromisoformat(sorted_sessions[0]['timestamp']).date()
    
    for session in sorted_sessions[1:]:
        session_date = datetime.fromisoformat(session['timestamp']).date()
        diff = (last_date - session_date).days
        
        if diff == 1:
            streak += 1
            last_date = session_date
        elif diff > 1:
            break
    
    return streak

@api_router.get("/games/progress/{child_id}", response_model=Progress)
async def get_progress(child_id: str, current_user: dict = Depends(get_current_user)):
    # Verify child belongs to parent
    child = await db.children.find_one({'id': child_id, 'parent_id': current_user['id']})
    if not child:
        raise HTTPException(status_code=403, detail='Child not found')
    
    progress = await db.progress.find_one({'child_id': child_id}, {'_id': 0})
    if not progress:
        # Return default progress
        return Progress(
            child_id=child_id,
            overall_progress=0,
            streak=0,
            total_time=0,
            games_played=0,
            last_played=datetime.now(timezone.utc).isoformat(),
            avg_accuracy=0
        )
    
    return Progress(**progress)

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {'_id': 0}).sort('timestamp', -1).to_list(100)
    return reviews

@api_router.post("/reviews", response_model=Review)
async def add_review(review_data: ReviewCreate):
    review = Review(**review_data.model_dump())
    review_dict = review.model_dump()
    await db.reviews.insert_one(review_dict)
    return review

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()