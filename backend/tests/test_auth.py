import pytest


def test_login_success(client):
    response = client.post("/api/auth/login", data={"username": "admin@test.com", "password": "password"})
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens and "refresh_token" in tokens


def test_login_failure(client):
    response = client.post("/api/auth/login", data={"username": "admin@test.com", "password": "wrong"})
    assert response.status_code == 401


def test_refresh_token(client):
    login = client.post("/api/auth/login", data={"username": "admin@test.com", "password": "password"}).json()
    refresh = login["refresh_token"]
    response = client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_read_me(client):
    token = client.post("/api/auth/login", data={"username": "admin@test.com", "password": "password"}).json()["access_token"]
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"
