from flask import Flask
from dotenv import load_dotenv
from nora.core.config import Config

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    from nora.routes import main
    app.register_blueprint(main)

    return app
