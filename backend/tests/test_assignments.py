import pytest

from app.models import UserRole

# helper for auth
def get_auth_headers(client, username, password):
    token = client.post("/api/auth/login", data={"username": username, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_read_assignments(client):
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    # create teacher and classroom
    teacher_data = {"email": "t3@test.com", "password": "password", "role": "teacher", "timezone": "UTC"}
    client.post("/api/users/", json=teacher_data, headers=admin_headers)
    teacher_headers = get_auth_headers(client, "t3@test.com", "password")
    r = client.post("/api/classrooms/", json={"name": "Science"}, headers=teacher_headers)
    classroom = r.json()
    # create assignment
    asg_data = {"title": "Chapter 1", "description": "Intro", "due_date": None, "classroom_id": classroom["id"]}
    r = client.post("/api/assignments/", json=asg_data, headers=teacher_headers)
    assert r.status_code == 200
    assignment = r.json()
    assert assignment["title"] == asg_data["title"]
    # student cannot create assignment
    client.post("/api/users/", json={"email": "s3@test.com", "password": "password", "role": "student", "timezone": "UTC"}, headers=admin_headers)
    student_headers = get_auth_headers(client, "s3@test.com", "password")
    r = client.post("/api/assignments/", json=asg_data, headers=student_headers)
    assert r.status_code == 403

    # read assignments
    r = client.get("/api/assignments/", headers=teacher_headers)
    assert any(a["id"] == assignment["id"] for a in r.json())

    # delete assignment
    r = client.delete(f"/api/assignments/{assignment['id']}", headers=teacher_headers)
    assert r.status_code == 204
