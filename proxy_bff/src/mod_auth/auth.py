from flask import Blueprint, jsonify, request
import os
import requests
from extensoes import bcrypt

bp_auth = Blueprint('auth', __name__, url_prefix="/api")

@bp_auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    print("[DEBUG] Enviando para:", os.environ.get("API_ENDPOINT_TOKEN"))
    print("[DEBUG] Username:", username)
    print("[DEBUG] Password:", password)

    if not username or not password:
        return jsonify({"error": "Credenciais inválidas"}), 400

    if username.startswith('@'):
        use_env = os.environ.get("API_USERNAME_TOKEN")
        pass_env = os.environ.get("API_PASSWORD_TOKEN")

        if username[1:] == use_env and password == pass_env:
            return jsonify({
                "nome": use_env,
                "grupo": "Administrador",
            }), 200
        else:
            return jsonify({"error": "Login local inválido"}), 401

    try:
        response = requests.post(
            os.environ.get("API_ENDPOINT_TOKEN"),
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"},
            verify=os.environ.get("API_SSL_VERIFY", "False").lower() != "false"
        )

        print("[DEBUG] Status API:", response.status_code)
        print("[DEBUG] Body API:", response.text)

        if response.status_code != 200:
            return jsonify({
                "error": "Login API inválido",
                "status": response.status_code,
                "detalhes": response.text
            }), 401

        return jsonify(response.json()), 200

    except Exception as e:
        print(f"Erro ao autenticar: {e}")
        return jsonify({"error": f"Erro ao autenticar: {str(e)}"}), 500
