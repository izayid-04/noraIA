import os
from dotenv import load_dotenv

# Charger le fichier .env
load_dotenv()

class Config:
    """Configuration principale de Nora"""
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_key")
    MILTRAT_API_KEY = os.getenv("MILTRAT_API_KEY")
    MILTRAT_API_URL = os.getenv("MILTRAT_API_URL", "https://api.miltrat.com/v1/chat")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
