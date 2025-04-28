# CODEX: Pydantic schemas for FeverDucation
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel
from app.models import UserRole

# User schemas
class UserBase(BaseModel):
    email: str
    role: UserRole
    timezone: Optional[str] = "UTC"

class UserCreate(UserBase):
    password: str

class ClassroomBrief(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class UserRead(UserBase):
    id: int
    created_at: datetime
    name: Optional[str] = None
    birthday: Optional[date] = None
    profile_photo: Optional[str] = None
    taught_classrooms: Optional[list[ClassroomBrief]] = []  # For teachers
    classrooms: Optional[list[ClassroomBrief]] = []         # For students
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    timezone: Optional[str] = None
    name: Optional[str] = None
    birthday: Optional[date] = None
    profile_photo: Optional[str] = None

# Classroom schemas
class ClassroomBase(BaseModel):
    name: str
    join_code: str

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomRead(ClassroomBase):
    id: int
    teacher_id: int
    created_at: datetime
    students: List[UserRead] = []
    class Config:
        orm_mode = True

# Subject schemas
class SubjectBase(BaseModel):
    name: str
    classroom_id: int

class SubjectCreate(SubjectBase):
    pass

class SubjectRead(SubjectBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Lesson schemas
class LessonBase(BaseModel):
    classroom_id: int
    title: str
    description: Optional[str] = None
    scheduled_date: date

class LessonCreate(LessonBase):
    pass

class LessonRead(LessonBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Assignment schemas
class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class AssignmentCreate(AssignmentBase):
    classroom_id: int
    subject_id: Optional[int]

class AssignmentRead(AssignmentBase):
    id: int
    classroom_id: int
    subject_id: Optional[int]
    created_at: datetime
    class Config:
        orm_mode = True

# Grade schemas
class GradeBase(BaseModel):
    score: int

class GradeCreate(GradeBase):
    student_id: int
    assignment_id: int

class GradeRead(GradeBase):
    id: int
    student_id: int
    assignment_id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Classroom join model
class JoinModel(BaseModel):
    join_code: str

# Advisor response schema
class AdvisorResponse(BaseModel):
    upcoming_lessons: List[LessonRead]
    pending_assignments: List[AssignmentRead]
    low_grades: List[GradeRead]

# Analytics schema
class AnalyticsRead(BaseModel):
    id: int
    student_id: Optional[int]
    teacher_id: Optional[int]
    data: dict
    created_at: datetime
    class Config:
        orm_mode = True

# Audit log schema
class AuditLogRead(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    timestamp: datetime
    class Config:
        orm_mode = True

# Preferences schemas
class PreferencesBase(BaseModel):
    theme: str
    language: str

class PreferencesRead(PreferencesBase):
    class Config:
        orm_mode = True

class PreferencesUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None

# Chat history schemas
class ChatMessageRead(BaseModel):
    id: int
    session_id: int
    sender: str
    text: str
    created_at: datetime
    class Config:
        orm_mode = True

class ChatSessionRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    messages: list[ChatMessageRead] = []
    class Config:
        orm_mode = True
