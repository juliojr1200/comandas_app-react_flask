from flask import session
from datetime import datetime, timedelta
import requests
from settings import API_ENDPOINT_TOKEN, API_USERNAME_TOKEN, API_PASSWORD_TOKEN, API_SSL_VERIFY
import logging

class Funcoes(object):
    # função para obter o token da API externa, retorna o json do token obtido ou do erro - os dados do token são armazenados na sessão do Flask para uso posterior
    @staticmethod
    def get_api_token():
        try:
            session.clear()

            logging.info(f"[DEBUG][TOKEN] Enviando para: {API_ENDPOINT_TOKEN}")
            logging.info(f"[DEBUG][TOKEN] Usuário: {API_USERNAME_TOKEN}")
            logging.info(f"[DEBUG][TOKEN] SSL_VERIFY: {API_SSL_VERIFY}")

            headers = {
                "accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }

            data = {
                "username": API_USERNAME_TOKEN,
                "password": API_PASSWORD_TOKEN
            }

            response = requests.post(
                API_ENDPOINT_TOKEN,
                headers=headers,
                data=data,
                verify=API_SSL_VERIFY
            )

            response.raise_for_status()

            token_data = response.json()

            if "access_token" not in token_data:
                msg = f"[ERRO] access_token não encontrado na resposta: {token_data}"
                logging.error(msg)
                raise KeyError(msg)

            session["access_token"] = token_data["access_token"]
            session["expire_minutes"] = token_data["expire_minutes"]
            session["token_type"] = token_data["token_type"]
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

    # valida o token armazenado na sessão. Caso esteja expirado ou não exista, faz até duas tentativas para obter um novo.
    @staticmethod
    def validar_token():
        for _ in range(2):  # Tenta obter o token no máximo 2 vezes
            if 'token_validade' in session and session['token_validade'] > datetime.timestamp(datetime.now()):
                # Token válido
                return True
            # Token inválido ou expirado, tenta obter um novo
            if 'access_token' in Funcoes.get_api_token():
                return True  # Novo token obtido com sucesso
        # Se chegar aqui, significa que não foi possível obter um token válido
        return False

    @staticmethod
    def make_api_request(method, url, data=None, params=None):
        # verifica se tem um token dentro da validade
        if Funcoes.validar_token() == False:
            return {'error': 'Falha ao obter token de autenticação'}, 500

        # monta o cabeçalho da requisição, com o token obtido
        headers = {
            'Authorization': f'Bearer {session["access_token"]}',
            'accept': 'application/json',
        }

        try:
            logging.info(f"Realizando requisição: {method.upper()} {url}")

            # realiza o request na API externa, utilizando o método, url, cabeçalho, dados e parâmetros fornecidos
            response = requests.request(method, url, headers=headers, json=data, params=params, verify=API_SSL_VERIFY)

            # quando a requisição é bem-sucedida (status 200-299): O método não faz nada e o código continua normalmente.
            # quando a requisição falha (status fora de 200-299): Ele lança uma exceção requests.exceptions.HTTPError.
            response.raise_for_status()

            # monta o json com os dados retornados
            result = response.json()

            # nossa a api retorna um array json, no qual o primeiro elemento é o resultado e o segundo elemento é o status_code
            return result[0] if response.content else {}, response.status_code

        except Exception as e:
            msg = f"Erro inesperado ao processar requisição para API externa: {e}"

            # Se a exceção for do tipo HTTPError, pode-se acessar o código de status e a mensagem de erro
            if isinstance(e, requests.exceptions.HTTPError):
                msg = f"Erro HTTP: {e.response.status_code} - {e.response.text}"
            elif isinstance(e, requests.exceptions.RequestException):
                msg = f"Erro de conexão/requisição com a API externa: {e}"

            logging.error(msg)
            return {'error': msg}, 500