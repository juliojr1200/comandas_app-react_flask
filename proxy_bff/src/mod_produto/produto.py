from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_PRODUTO, API_USERNAME_TOKEN
from funcoes import Funcoes
import base64

bp_produto = Blueprint('produto', __name__, url_prefix="/api/produto")


@bp_produto.route('/all', methods=['GET'])
def get_produtos():
    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify([
            {
                "id_produto": 1,
                "nome": "Camiseta Preta",
                "descricao": "Camiseta de algodão",
                "valor_unitario": 59.9,
                "foto": "https://via.placeholder.com/150"
            },
            {
                "id_produto": 2,
                "nome": "Tênis Branco",
                "descricao": "Tênis casual",
                "valor_unitario": 189.9,
                "foto": "https://via.placeholder.com/150"
            }
        ]), 200

    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_PRODUTO)
    if isinstance(response_data, list):
        for item in response_data:
            if 'nome_produto' in item:
                item['nome'] = item.pop('nome_produto')
    return jsonify(response_data), status_code


@bp_produto.route('/one', methods=['GET'])
def get_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "Parâmetro 'id_produto' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({
            "id_produto": int(id_produto),
            "nome": "Produto Mock",
            "descricao": "Descrição do produto mock",
            "valor_unitario": 99.99,
            "foto": "https://via.placeholder.com/150"
        }), 200

    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    if isinstance(response_data, dict) and 'nome_produto' in response_data:
        response_data['nome'] = response_data.pop('nome_produto')
    elif isinstance(response_data, list) and response_data and 'nome_produto' in response_data[0]:
        response_data[0]['nome'] = response_data[0].pop('nome_produto')
    return jsonify(response_data), status_code


@bp_produto.route('/', methods=['DELETE'])
def delete_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "Parâmetro 'id_produto' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": f"Produto {id_produto} deletado com sucesso (mock)"}), 200

    return Funcoes.make_api_request('delete', f"{API_ENDPOINT_PRODUTO}{id_produto}")


@bp_produto.route('/', methods=['POST'])
def create_produto():
    foto = request.files.get('foto')
    foto_base64 = ""
    if foto:
        foto_data = foto.read()
        foto_base64 = base64.b64encode(foto_data).decode('utf-8')
        foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"

    data = {
        "nome_produto": request.form.get('nome'),
        "descricao": request.form.get('descricao'),
        "valor_unitario": request.form.get('valor_unitario'),
        "foto": foto_base64
    }

    if not all([data["nome_produto"], data["descricao"], data["valor_unitario"], data["foto"]]):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        data["id_produto"] = 999
        return jsonify({**data, "nome": data.pop("nome_produto")}), 201

    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_PRODUTO, data=data)
    return jsonify(response_data), status_code


@bp_produto.route('/', methods=['PUT'])
def update_produto():
    foto = request.files.get('foto')
    if foto:
        foto_data = foto.read()
        foto_base64 = base64.b64encode(foto_data).decode('utf-8')
        foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"
    else:
        foto_base64 = request.form.get('foto')

    data = {
        "id_produto": request.form.get('id_produto'),
        "nome_produto": request.form.get('nome'),
        "descricao": request.form.get('descricao'),
        "valor_unitario": request.form.get('valor_unitario'),
        "foto": foto_base64
    }

    if not all([data["id_produto"], data["nome_produto"], data["descricao"], data["valor_unitario"], data["foto"]]):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({**data, "nome": data.pop("nome_produto")}), 200

    response_data, status_code = Funcoes.make_api_request(
        'put', f"{API_ENDPOINT_PRODUTO}{data['id_produto']}", data=data
    )
    if isinstance(response_data, dict) and 'nome_produto' in response_data:
        response_data['nome'] = response_data.pop('nome_produto')
    return jsonify(response_data), status_code
