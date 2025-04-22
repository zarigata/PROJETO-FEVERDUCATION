"""
CODEX-STYLE USERS ROUTES MODULE
Manages user CRUD operations. Only admin can manage other users; users can view own profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import psycopg2
from typing import List
from app.config import config
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

# Pydantic schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str  # student, teacher, admin

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# Dependency: ensure user is admin
async def admin_required(token: str = Depends(oauth2_scheme)):
    from app.api.routes.auth import get_current_user
    current_user = await get_current_user(token)
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires admin privileges")
    return current_user

# Establish DB connection helper
def get_db_connection():
    db = config['database']
    return psycopg2.connect(
        host=db['host'], port=db['port'], dbname=db['name'],
        user=db['user'], password=db['password']
    )

# Create user (admin only)
@router.post("/users", response_model=UserResponse, dependencies=[Depends(admin_required)])
async def create_user(user: UserCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username, email, hashed_password, role) VALUES (%s, %s, crypt(%s, gen_salt('bf')), %s) RETURNING id, username, email, role",  # using PostgreSQL crypt
        (user.username, user.email, user.password, user.role)
    )
    new_user = cur.fetchone()
    conn.commit()
    conn.close()
    return {"id": new_user[0], "username": new_user[1], "email": new_user[2], "role": new_user[3]}

# List users (admin only)
@router.get("/users", response_model=List[UserResponse], dependencies=[Depends(admin_required)])
async def list_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, role FROM users")
    rows = cur.fetchall()
    conn.close()
    return [{"id": r[0], "username": r[1], "email": r[2], "role": r[3]} for r in rows]

# Get user by ID (admin can, user can view self)
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, current_user: dict = Depends(admin_required)):
    if current_user['role'] != 'admin' and current_user['id'] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, role FROM users WHERE id = %s", (user_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return {"id": row[0], "username": row[1], "email": row[2], "role": row[3]}

# Delete user (admin only)
@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(admin_required)])
async def delete_user(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    conn.close()
