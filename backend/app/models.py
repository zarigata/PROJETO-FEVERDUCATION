# CODEX: SQLAlchemy models defining the database schema for FeverDucation
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Table, JSON
from sqlalchemy.orm import relationship
from app.database import Base

# CODEX: Define user roles with an Enum for integrity and clarity
class UserRole(enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"

# CODEX: Association table for many-to-many relation between classrooms and students
classroom_students = Table(
    'classroom_students', Base.metadata,
    Column('classroom_id', Integer, ForeignKey('classrooms.id'), primary_key=True),
    Column('student_id', Integer, ForeignKey('users.id'), primary_key=True)
)

# CODEX: User model storing credentials and role information
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    timezone = Column(String, default="UTC")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    taught_classrooms = relationship("Classroom", back_populates="teacher")
    classrooms = relationship("Classroom", secondary=classroom_students, back_populates="students")
    grades = relationship("Grade", back_populates="student")
    audit_logs = relationship("AuditLog", back_populates="user")

# CODEX: Classroom model with a teacher and student roster
class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("User", back_populates="taught_classrooms")
    students = relationship("User", secondary=classroom_students, back_populates="classrooms")
    assignments = relationship("Assignment", back_populates="classroom")

# CODEX: Assignment model for classroom tasks
class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="assignments")
    grades = relationship("Grade", back_populates="assignment")

# CODEX: Grade model linking students to assignment results
class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="grades")
    assignment = relationship("Assignment", back_populates="grades")

# CODEX: Analytics model for storing precomputed insights
class Analytics(Base):
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# CODEX: Audit log model for tracking admin actions
class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
