from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_CLIENTE, API_USERNAME_TOKEN
from funcoes import Funcoes

bp_cliente = Blueprint('cliente', __name__, url_prefix="/api/cliente")


# --- Rotas da API do Backend (que serão consumidas pelo React) ---

@bp_cliente.route('/all', methods=['GET'])
def get_clientes():
    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify([
            {"id_cliente": 1, "nome": "João da Silva", "cpf": "12345678900", "telefone": "11999999999"},
            {"id_cliente": 2, "nome": "Maria Oliveira", "cpf": "98765432100", "telefone": "11888888888"}
        ]), 200

    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_CLIENTE)
    return jsonify(response_data), status_code


@bp_cliente.route('/one', methods=['GET'])
def get_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({
            "id_cliente": int(id_cliente),
            "nome": "João da Silva",
            "cpf": "12345678900",
            "telefone": "11999999999"
        }), 200

    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code


@bp_cliente.route('/', methods=['POST'])
def create_cliente():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()

    required_fields = ['nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": "Cliente criado com sucesso (mock)", "data": data}), 201

    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_CLIENTE, data=data)
    return jsonify(response_data), status_code


@bp_cliente.route('/', methods=['PUT'])
def update_cliente():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()

    required_fields = ['id_cliente', 'nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    id_cliente = data.get('id_cliente')
    payload = {
        "nome": data['nome'],
        "cpf": data['cpf'],
        "telefone": data['telefone']
    }

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": f"Cliente {id_cliente} atualizado (mock)", "data": payload}), 200

    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_CLIENTE}{id_cliente}", data=payload)
    return jsonify(response_data), status_code


@bp_cliente.route('/', methods=['DELETE'])
def delete_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": f"Cliente {id_cliente} removido com sucesso (mock)"}), 200

    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code


@bp_cliente.route('/cpf', methods=['GET'])
def validate_cpf():
    cpf = request.args.get('cpf')
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        # Simula CPF existente
        if cpf == "12345678900":
            return jsonify({"existe": True}), 200
        else:
            return jsonify({"existe": False}), 200

    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}cpf/", params={'cpf': cpf})
    return jsonify(response_data), status_code
