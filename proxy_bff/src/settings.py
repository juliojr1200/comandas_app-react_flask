from dotenv import load_dotenv, find_dotenv
import os

# Carrega o arquivo .env se existir
dotenv_file = find_dotenv()
load_dotenv(dotenv_file)

# Valores obtidos de variáveis de ambiente
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
PROXY_PORT = int(os.getenv("PROXY_PORT", 5000))
PROXY_DEBUG = os.getenv("PROXY_DEBUG", "True").lower() == "true"

# Se a API usa HTTPS com certificado válido
API_SSL_VERIFY = os.getenv("API_SSL_VERIFY", "False").lower() == "true"

# URLs da API
API_URL = os.getenv('API_URL', 'http://localhost:5000')
API_USERNAME_TOKEN = os.getenv("API_USERNAME_TOKEN", "abc")
API_PASSWORD_TOKEN = os.getenv("API_PASSWORD_TOKEN", "bolinhas")
API_PASSWORD_HASH = os.getenv("API_PASSWORD_HASH", "$2b$12$MBETvcDw6pL3ld1VkPuavuHd8/EckFFY6enGXhG4i.3UT0nwHvPHy")

# Endpoints formatados
API_ENDPOINT_TOKEN = f"{API_URL}/api/login"
API_ENDPOINT_FUNCIONARIO = f"{API_URL}/funcionario/"
API_ENDPOINT_CLIENTE = f"{API_URL}/cliente/"
API_ENDPOINT_PRODUTO = f"{API_URL}/produto/"

# Tempo de sessão
TEMPO_SESSION = int(os.getenv("TEMPO_SESSION", 30))
