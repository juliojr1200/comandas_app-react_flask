from flask import session
from datetime import datetime, timedelta
import requests
from settings import (
    API_ENDPOINT_TOKEN,
    API_USERNAME_TOKEN,
    API_PASSWORD_TOKEN,
    API_SSL_VERIFY
)
import logging

class Funcoes(object):
    @staticmethod
    def get_api_token():
        try:
            session.clear()

            # 👉 Modo local ativado se username começa com '@'
            if API_USERNAME_TOKEN.startswith("@"):
                logging.info("[DEBUG] Login local detectado, ignorando API externa")
                session["access_token"] = "localtoken"
                session["token_type"] = "Bearer"
                session["expire_minutes"] = 60
                session["token_validade"] = datetime.timestamp(
                    datetime.now() + timedelta(minutes=60)
                )
                return {
                    "access_token": "localtoken",
                    "token_type": "Bearer",
                    "expire_minutes": 60
                }

            logging.info(f"[DEBUG][TOKEN] Enviando para: {API_ENDPOINT_TOKEN}")
            logging.info(f"[DEBUG][TOKEN] Usuário: {API_USERNAME_TOKEN}")
            logging.info(f"[DEBUG][TOKEN] SSL_VERIFY: {API_SSL_VERIFY}")

            headers = {
                "accept": "application/json",
                "Content-Type": "application/json"
            }

            payload = {
                "username": API_USERNAME_TOKEN,
                "password": API_PASSWORD_TOKEN
            }

            response = requests.post(
                API_ENDPOINT_TOKEN,
                headers=headers,
                json=payload,
                verify=API_SSL_VERIFY
            )

            response.raise_for_status()
            token_data = response.json()

            if "access_token" not in token_data:
                msg = f"[ERRO] access_token não encontrado na resposta: {token_data}"
                logging.error(msg)
                raise KeyError(msg)

            session["access_token"] = token_data["access_token"]
            session["token_type"] = token_data["token_type"]
            session["expire_minutes"] = token_data["expire_minutes"]
            session["token_validade"] = datetime.timestamp(
                datetime.now() + timedelta(minutes=token_data["expire_minutes"])
            )

            logging.info(f"[DEBUG] Token OK: {session['access_token']}")

            return token_data

        except Exception as e:
            if isinstance(e, requests.exceptions.HTTPError):
                msg = f"[ERRO HTTP] {e.response.status_code} - {e.response.text}"
            else:
                msg = f"[ERRO GERAL] {str(e)}"

            logging.error(msg)
            return {"error": msg}, 500

    @staticmethod
    def validar_token():
        for _ in range(2):
            if 'token_validade' in session and session['token_validade'] > datetime.timestamp(datetime.now()):
                return True
            if 'access_token' in Funcoes.get_api_token():
                return True
        return False

    @staticmethod
    def make_api_request(method, url, data=None, params=None):
        # MOCK: Funcionários (mantido como você fez)
        if "funcionario" in url:
            return [
                {"id_funcionario": 1, "nome": "João", "grupo": "Admin"},
                {"id_funcionario": 2, "nome": "Maria", "grupo": "Vendas"},
            ], 200

        # LOGIN LOCAL: ignora autenticação externa
        if not Funcoes.validar_token():
            return {'error': 'Falha ao obter token de autenticação'}, 500

        # Requisição real ou local
        headers = {
            'Authorization': f'Bearer {session["access_token"]}',
            'accept': 'application/json',
        }

        try:
            logging.info(f"Realizando requisição: {method.upper()} {url}")
            response = requests.request(
                method,
                url,
                headers=headers,
                json=data,
                params=params,
                verify=API_SSL_VERIFY
            )

            response.raise_for_status()
            result = response.json()

            if isinstance(result, list):
                return result[0], response.status_code
            return result, response.status_code

        except Exception as e:
            msg = f"Erro inesperado ao processar requisição para API externa: {e}"

            if isinstance(e, requests.exceptions.HTTPError):
                msg = f"Erro HTTP: {e.response.status_code} - {e.response.text}"
            elif isinstance(e, requests.exceptions.RequestException):
                msg = f"Erro de conexão/requisição com a API externa: {e}"

            logging.error(msg)
            return {'error': msg}, 500
