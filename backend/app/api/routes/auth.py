"""
CODEX-STYLE AUTH ROUTES MODULE
Implements user authentication: login, token refresh, and user info retrieval via FastAPI.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
import psycopg2
from passlib.context import CryptContext
from jose import JWTError, jwt
from app.config import config
from app.api.routes.users import get_db_connection, UserResponse

# Initialize router for auth endpoints
router = APIRouter()
# OAuth2 scheme for handling Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")
# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings from configuration
SECRET_KEY = config['jwt']['secret_key']
ALGORITHM = config['jwt']['algorithm']
ACCESS_TOKEN_EXPIRE_MINUTES = config['jwt'].get('access_token_expire_minutes', 30)

# Pydantic models for request/response
class Token(BaseModel):
    access_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str

class User(BaseModel):
    id: int
    username: str
    role: str

# Verify provided password against hashed
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Authenticate user credentials against database
def authenticate_user(username: str, password: str):
    db = config['database']
    conn = psycopg2.connect(
        host=db['host'], port=db['port'], dbname=db['name'],
        user=db['user'], password=db['password']
    )
    cur = conn.cursor()
    cur.execute(
        "SELECT id, username, hashed_password, role FROM users WHERE username = %s",
        (username,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    user_id, user_name, hashed_pwd, role = row
    if not verify_password(password, hashed_pwd):
        return None
    # Return user dict on successful auth
    return {"id": user_id, "username": user_name, "role": role}

# Create JWT access token with expiration
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Login endpoint: grants JWT on valid credentials
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = create_access_token(
        {"sub": user['username'], "user_id": user['id'], "role": user['role']}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Refresh endpoint: accepts a refresh token and returns new access token
@router.post("/refresh", response_model=Token)
async def refresh_token(req: RefreshRequest):
    try:
        payload = jwt.decode(req.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    new_token = create_access_token({"sub": username, "user_id": user_id, "role": role})
    return {"access_token": new_token, "token_type": "bearer"}

# Public registration endpoint
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post("/register", response_model=UserResponse)
async def register_user(data: RegisterRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username, email, hashed_password, role) VALUES (%s, %s, crypt(%s, gen_salt('bf')), %s) RETURNING id, username, email, role",
        (data.username, data.email, data.password, 'student')
    )
    new_user = cur.fetchone()
    conn.commit()
    conn.close()
    return {"id": new_user[0], "username": new_user[1], "email": new_user[2], "role": new_user[3]}

# Dependency: extract current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        if username is None:
            raise JWTError()
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return {"id": user_id, "username": username, "role": role}

# Me endpoint: returns current user info
@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
