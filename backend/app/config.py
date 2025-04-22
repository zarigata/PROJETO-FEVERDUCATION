# Shared configuration loader
import os
import yaml

config_path = os.getenv("CONFIG_PATH", "../config/config.yaml")
with open(config_path, "r") as f:
    config = yaml.safe_load(f)
