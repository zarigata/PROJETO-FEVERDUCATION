"""
CODEX-STYLE DB INIT SCRIPT
Executes schema.sql to create tables and inserts default admin user.
"""
import os
import yaml
import psycopg2
from passlib.context import CryptContext

# Load configuration
config_path = os.getenv("CONFIG_PATH", os.path.join(os.path.dirname(__file__), "..", "..", "config", "config.yaml"))
with open(config_path, "r") as f:
    cfg = yaml.safe_load(f)

db_cfg = cfg.get("database", {})
admin_cfg = cfg.get("admin", {})

# Establish password context
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Read SQL schema
schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
with open(schema_file, "r") as f:
    schema_sql = f.read()

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=db_cfg.get("host"),
    port=db_cfg.get("port"),
    dbname=db_cfg.get("name"),
    user=db_cfg.get("user"),
    password=db_cfg.get("password")
)
cur = conn.cursor()

# Execute schema
cur.execute(schema_sql)

# Insert default admin (skip if exists)
username = admin_cfg.get("username")
role = "admin"

# Determine hashed password
if admin_cfg.get("hashed_password"):
    hashed_pwd = admin_cfg["hashed_password"]
elif admin_cfg.get("password"):
    hashed_pwd = pwd_ctx.hash(admin_cfg.get("password"))
else:
    raise ValueError("Admin credentials not found in config.yaml")

email = admin_cfg.get("email", f"{username}@example.com")

cur.execute(
    "INSERT INTO users (username, email, hashed_password, role) VALUES (%s, %s, %s, %s) "
    "ON CONFLICT (username) DO NOTHING;",
    (username, email, hashed_pwd, role)
)

conn.commit()
cur.close()
conn.close()

print("Database initialized and default admin user ensured.")
