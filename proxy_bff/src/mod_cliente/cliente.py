# proxy_bff/src/mod_cliente/cliente.py
from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_CLIENTE
from funcoes import Funcoes

bp_cliente = Blueprint('cliente', __name__, url_prefix="/api/cliente")


# --- Rotas da API do Backend (que serão consumidas pelo React) ---

# READ (All): Listar todos os clientes
@bp_cliente.route('/all', methods=['GET'])
def get_clientes():
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_CLIENTE)
    return jsonify(response_data), status_code


# READ (One): Obter um cliente específico pelo ID
@bp_cliente.route('/one', methods=['GET'])
def get_cliente():
    # id_cliente vindo como querystring: /api/cliente/one?id_cliente=123
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400

    # Encaminha a requisição GET para a API externa: GET {API_ENDPOINT_CLIENTE}{id_cliente}
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code


# CREATE (POST): Inserir um novo cliente
@bp_cliente.route('/', methods=['POST'])
def create_cliente():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()

    # Campos obrigatórios: nome, cpf, telefone
    required_fields = ['nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    # Envia POST para a API externa: POST {API_ENDPOINT_CLIENTE}  com JSON = data
    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_CLIENTE, data=data)
    return jsonify(response_data), status_code


# UPDATE (PUT): Atualizar um cliente existente
@bp_cliente.route('/', methods=['PUT'])
def update_cliente():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()

    # Esperamos receber id_cliente + campos obrigatórios
    required_fields = ['id_cliente', 'nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    id_cliente = data.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório para atualização"}), 400

    # Monta o JSON a ser enviado (sem incluir id_cliente como parte do corpo, se a API externa não exigir)
    payload = {
        "nome": data['nome'],
        "cpf": data['cpf'],
        "telefone": data['telefone']
    }
    # Encaminha PUT para a API externa: PUT {API_ENDPOINT_CLIENTE}{id_cliente}
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_CLIENTE}{id_cliente}", data=payload)
    return jsonify(response_data), status_code


# DELETE: Remover um cliente
@bp_cliente.route('/', methods=['DELETE'])
def delete_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400

    # Encaminha DELETE para a API externa: DELETE {API_ENDPOINT_CLIENTE}{id_cliente}
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code


# GET /cpf: Validar se existe cliente com mesmo CPF
@bp_cliente.route('/cpf', methods=['GET'])
def validate_cpf():
    cpf = request.args.get('cpf')
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400

    # Encaminha GET para a API externa: GET {API_ENDPOINT_CLIENTE}cpf/?cpf=<cpf>
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}cpf/", params={'cpf': cpf})
    return jsonify(response_data), status_code
