from flask import Blueprint, jsonify, request
import os
import requests
from extensoes import bcrypt

bp_auth = Blueprint('auth', __name__, url_prefix="/api")

@bp_auth.route('/login', methods=['POST'])
def login():
    # Suporte tanto para JSON quanto form-urlencoded
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    username = data.get('username')
    password = data.get('password')

    print("[AUTH DEBUG] Enviando para:", os.environ.get("API_ENDPOINT_TOKEN"))
    print("[AUTH DEBUG] Username:", username)
    print("[AUTH DEBUG] Password:", password)

    if not username or not password:
        return jsonify({"error": "Credenciais inválidas"}), 400

    # --- Modo local (mock) ativado com username iniciando com @ ---
    if username.startswith('@'):
        env_username = os.environ.get("API_USERNAME_TOKEN", "")
        env_hash = os.environ.get("API_PASSWORD_HASH", "")

        if username[1:] == env_username and bcrypt.check_password_hash(env_hash, password):
            return jsonify({
                "nome": env_username,
                "grupo": "Administrador",
            }), 200
        else:
            return jsonify({"error": "Login local inválido"}), 401

    # --- Modo produção: login real via API externa ---
    try:
        payload = {
            "username": username,
            "password": password
        }

        response = requests.post(
            os.environ.get("API_ENDPOINT_TOKEN"),
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            verify=os.environ.get("API_SSL_VERIFY", "False").lower() != "false"
        )

        print("[AUTH DEBUG] Status da API:", response.status_code)
        print("[AUTH DEBUG] Corpo da resposta:", response.text)

        if response.status_code != 200:
            return jsonify({
                "error": "Login API inválido",
                "status": response.status_code,
                "detalhes": response.text
            }), 401

        return jsonify(response.json()), 200

    except Exception as e:
        print("[AUTH ERROR] Falha ao autenticar:", e)
        return jsonify({"error": f"Erro ao autenticar: {str(e)}"}), 500
