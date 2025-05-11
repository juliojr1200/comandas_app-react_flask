import os
from flask import Flask, send_from_directory, session
from datetime import timedelta
import logging
# carrega o arquivo .env, variáveis de ambiente
from settings import PROXY_PORT, PROXY_DEBUG, TEMPO_SESSION

from funcoes import Funcoes

# Configuração básica de logging
logging.basicConfig(level=logging.INFO)
# Aplicação Flask
app = Flask(__name__)

# Flask não serve automaticamente o favicon, então você precisa criar uma rota para ele
# crie um arquivo favicon.ico na pasta static
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        directory='static',
        path='favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

# rota somente para teste de comunicação com a API e geração do token
# não é utilizada na aplicação, mas pode ser útil para verificar se a API está acessível
@app.route('/api/teste_token', methods=['POST'])
def teste_token():
    return Funcoes.get_api_token()

# código omitido
# ponto de entrada para execução
if __name__ == '__main__':
    logging.info(f"Iniciando o servidor Flask na porta: {PROXY_PORT}")
    # Roda o servidor Flask em modo de debug (recarrega automaticamente e mostra mais erros)
    # Desative o debug em produção!
    app.run(host='0.0.0.0', port=PROXY_PORT, debug=PROXY_DEBUG, use_reloader=PROXY_DEBUG)