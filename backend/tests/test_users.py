import pytest

def get_auth_headers(client, username, password):
    token = client.post("/api/auth/login", data={"username": username, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_read_user(client):
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    user_data = {"email": "teacher@test.com", "password": "teachpass", "role": "teacher", "timezone": "UTC"}
    res = client.post("/api/users/", json=user_data, headers=admin_headers)
    assert res.status_code == 200
    created = res.json()
    assert created["email"] == user_data["email"]
    assert created["role"] == user_data["role"]

    # read list
    res = client.get("/api/users/", headers=admin_headers)
    assert res.status_code == 200
    assert any(u["email"] == user_data["email"] for u in res.json())

    # read single
    uid = created["id"]
    res = client.get(f"/api/users/{uid}", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["id"] == uid


def test_non_admin_cannot_create_user(client):
    # create student
    admin_headers = get_auth_headers(client, "admin@test.com", "password")
    client.post("/api/users/", json={"email": "student@test.com", "password": "studpass", "role": "student", "timezone": "UTC"}, headers=admin_headers)
    student_headers = get_auth_headers(client, "student@test.com", "studpass")
    res = client.post("/api/users/", json={"email": "x@test.com", "password": "xpass", "role": "student"}, headers=student_headers)
    assert res.status_code == 403
