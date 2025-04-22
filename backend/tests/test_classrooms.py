import pytest

# helper for auth
def get_auth_headers(client, username, password):
    token = client.post("/api/auth/login", data={"username": username, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_teacher_can_create_classroom(client):
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    # create teacher
    teacher_data = {"email": "teacher2@test.com", "password": "teach2pass", "role": "teacher", "timezone": "UTC"}
    r = client.post("/api/users/", json=teacher_data, headers=admin_headers)
    assert r.status_code == 200
    # login teacher and create classroom
    teacher_headers = get_auth_headers(client, "teacher2@test.com", "teach2pass")
    r = client.post("/api/classrooms/", json={"name": "Math"}, headers=teacher_headers)
    assert r.status_code == 200
    classroom = r.json()
    assert classroom["name"] == "Math"
    # teacher reads own classrooms
    r = client.get("/api/classrooms/", headers=teacher_headers)
    assert any(c["id"] == classroom["id"] for c in r.json())


def test_student_cannot_create_classroom(client):
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    # create student
    client.post("/api/users/", json={"email": "student2@test.com", "password": "stud2", "role": "student", "timezone": "UTC"}, headers=admin_headers)
    student_headers = get_auth_headers(client, "student2@test.com", "stud2")
    r = client.post("/api/classrooms/", json={"name": "History"}, headers=student_headers)
    assert r.status_code == 403


def test_admin_can_read_all_classrooms(client):
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    r = client.get("/api/classrooms/", headers=admin_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
