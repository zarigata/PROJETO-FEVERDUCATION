import pytest

def get_auth_headers(client, username, password):
    token = client.post("/api/auth/login", data={"username": username, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_teacher_can_create_and_student_can_read_grade(client):
    # Admin creates teacher and student
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    teacher_data = {"email": "tgr@test.com", "password": "pass", "role": "teacher", "timezone": "UTC"}
    client.post("/api/users/", json=teacher_data, headers=admin_headers)
    student_data = {"email": "stu@test.com", "password": "pass", "role": "student", "timezone": "UTC"}
    client.post("/api/users/", json=student_data, headers=admin_headers)

    # Teacher setup
    teacher_headers = get_auth_headers(client, teacher_data["email"], teacher_data["password"])
    # Create classroom and assignment
    cls = client.post("/api/classrooms/", json={"name":"G"}, headers=teacher_headers).json()
    asg = client.post("/api/assignments/", json={"title":"T1","description":"D","due_date":None,"classroom_id":cls["id"]}, headers=teacher_headers).json()

    # Teacher creates grade
    grade_in = {"student_id": client.get("/api/users/", headers=admin_headers).json()[-1]["id"], "assignment_id": asg["id"], "score": 85}
    r = client.post("/api/grades/", json=grade_in, headers=teacher_headers)
    assert r.status_code == 200
    grade = r.json()
    assert grade["score"] == 85

    # Student reads own grades
    student_headers = get_auth_headers(client, student_data["email"], student_data["password"])
    rr = client.get("/api/grades/", headers=student_headers)
    assert rr.status_code == 200
    assert any(g["id"] == grade["id"] for g in rr.json())
