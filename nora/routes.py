from flask import Blueprint, request, jsonify, render_template
from nora.services.miltrat_api import ask_nora
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    # Récupérer les variables d'environnement pour les liens sociaux
    config = {
        'PORTFOLIO_URL': os.getenv('PORTFOLIO_URL', '#'),
        'GITHUB_URL': os.getenv('GITHUB_URL', '#'),
        'LINKEDIN_URL': os.getenv('LINKEDIN_URL', '#'),
        'TWITTER_URL': os.getenv('TWITTER_URL', '#')
    }
    return render_template('index.html', **config)

@main.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message vide"}), 400

    reply = ask_nora(message)
    return jsonify({"reply": reply})