from flask import Flask
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()
    
    # Flask cherchera dans ../templates (à la racine du projet)
    app = Flask(__name__, 
                template_folder='../templates',
                static_folder='../static')
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Enregistrer les blueprints
    from nora.routes import main
    app.register_blueprint(main)
    
    return app