from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_PRODUTO
from funcoes import Funcoes
import base64

bp_produto = Blueprint('produto', __name__, url_prefix="/api/produto")

# --- Rotas da API do Backend (que serão consumidas pelo React) ---

# Rota para Listar todos os Produtos (READ - All)
@bp_produto.route('/all', methods=['GET'])
def get_produtos():
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_PRODUTO)
    # mapeia nome_produto para nome na resposta
    if isinstance(response_data, list):
        for item in response_data:
            if 'nome_produto' in item:
                item['nome'] = item.pop('nome_produto')
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Obter um Produto Específico (READ - One)
@bp_produto.route('/one', methods=['GET'])
def get_produto():
    # obtém o ID do Produto a partir dos parâmetros de consulta da URL
    id_produto = request.args.get('id_produto')
    # valida se o id_produto foi passado na URL
    if not id_produto:
        return jsonify({"error": Funcoes.PARAMETRO_ID_PRODUTO_OBRIGATORIO}), 400
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    # mapeia nome_produto para nome na resposta
    if isinstance(response_data, dict) and 'nome_produto' in response_data:
        response_data['nome'] = response_data.pop('nome_produto')
    elif isinstance(response_data, list) and len(response_data) > 0 and 'nome_produto' in response_data[0]:
        response_data[0]['nome'] = response_data[0].pop('nome_produto')
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Deletar um Produto (DELETE)
@bp_produto.route('/', methods=['DELETE'])
def delete_produto():
    # obtém o ID do Produto a partir dos parâmetros de consulta da URL
    id_produto = request.args.get('id_produto')
    print(f"ID do produto a ser deletado: {id_produto}")
    # valida se o id_produto foi passado na URL
    if not id_produto:
        return jsonify({"error": Funcoes.PARAMETRO_ID_PRODUTO_OBRIGATORIO}), 400
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Criar um novo Produto (POST)
@bp_produto.route('/', methods=['POST'])
def create_produto():
    # obtém a foto enviada no formulário
    # o arquivo deve ter sido enviado como multipart/form-data
    foto = request.files.get('foto')
    # Converte a foto para Base64
    # realiza a leitura do conteúdo do arquivo com a foto
    foto_data = foto.read()
    # converte para Base64
    foto_base64 = base64.b64encode(foto_data).decode('utf-8')
    # adiciona o prefixo para indicar o tipo de arquivo
    foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"
    # Monta o JSON para enviar à API externa
    data = {
        "nome_produto": request.form.get('nome'),  # Alterado de "nome" para "nome_produto"
        "descricao": request.form.get('descricao'),
        "valor_unitario": request.form.get('valor_unitario'),
        "foto": foto_base64
    }
    # Faz a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_PRODUTO, data=data)
    # Retorna o JSON da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Atualizar um Produto existente (PUT)
@bp_produto.route('/', methods=['PUT'])
def update_produto():
    # Obtém a foto enviada no formulário
    # O arquivo deve ter sido enviado como multipart/form-data
    foto = request.files.get('foto')
    # Nos casos onde o usuário não alterar a foto
    # O conteúdo da foto já pode ter vindo como base64
    # Então nesses casos não é necessário converter novamente
    if foto:
        # Nova foto foi enviada
        # Converte a foto para Base64
        # Realiza a leitura do conteúdo do arquivo com a foto
        foto_data = foto.read()
        # Converte para Base64
        foto_base64 = base64.b64encode(foto_data).decode('utf-8')
        # Adiciona o prefixo para indicar o tipo de arquivo
        foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"
    else:
        # Foto não foi enviada, então vamos usar a foto já existente
        # Os dados já foram enviados como base64
        # Realizar a leitura normal do conteúdo
        foto_base64 = request.form.get('foto')
    
    # Monta o JSON para enviar à API externa
    data = {
        "id_produto": request.form.get('id_produto'),
        "nome_produto": request.form.get('nome'),  # Mapeia 'nome' do frontend para 'nome_produto'
        "descricao": request.form.get('descricao'),
        "valor_unitario": request.form.get('valor_unitario'),
        "foto": foto_base64
    }
    
    # Valida se todos os campos obrigatórios estão presentes
    if not all([data["id_produto"], data["nome_produto"], data["descricao"], data["valor_unitario"], data["foto"]]):
        print("Campos obrigatórios faltando:", data)
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400
    
    # Log dos dados que serão enviados para a API externa
    print("Dados enviados para a API externa:", data)
    
    # Chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_PRODUTO}{data.get('id_produto')}", data=data)
    
    # Log da resposta da API externa
    print("Resposta da API externa:", response_data, "Status:", status_code)
    
    # Mapeia nome_produto para nome na resposta
    if isinstance(response_data, dict) and 'nome_produto' in response_data:
        response_data['nome'] = response_data.pop('nome_produto')
    
    # Retorna o JSON da resposta da API externa
    return jsonify(response_data), status_code