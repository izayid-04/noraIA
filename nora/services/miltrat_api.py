import os
import requests

MILTRAT_API_KEY = os.getenv("MILTRAT_API_KEY")
MILTRAT_API_URL = os.getenv("MILTRAT_API_URL")

def ask_nora(message: str):
    """
    Envoie le message à l'API Mistral et renvoie la réponse personnalisée de Nora
    """
    if not MILTRAT_API_KEY:
        return "Erreur : clé API Mistral non définie."

    headers = {
        "Authorization": f"Bearer {MILTRAT_API_KEY}",
        "Content-Type": "application/json"
    }

    # Prompt personnalisé pour que Nora ait sa personnalité
    system_prompt = (
        "Tu es Nora, une IA conversationnelle. "
        "Toujours répondre sous le nom de Nora. "
        "Si on te demande qui t'a créée ou ton développeur, répondre : 'C'est Izayid qui m'a conçue.' "
        "Sinon, réponds normalement aux questions et reste polie et amicale."
    )

    # Format correct pour l'API Mistral
    payload = {
        "model": "mistral-tiny",  # ou "mistral-small", "mistral-medium"
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        response = requests.post(MILTRAT_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Extraction de la réponse selon le format Mistral
        if data.get("choices") and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"]
        else:
            return "Nora n'a pas pu générer de réponse."
            
    except Exception as e:
        return f"Erreur lors de la connexion à l'API : {e}"