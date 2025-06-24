from flask import Blueprint, jsonify, request, send_file
from settings import API_ENDPOINT_FUNCIONARIO, API_USERNAME_TOKEN
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from funcoes import Funcoes
from extensoes import bcrypt

bp_funcionario = Blueprint('funcionario', __name__, url_prefix="/api/funcionario")


@bp_funcionario.route('/all', methods=['GET'])
def get_funcionarios():
    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify([
            {"id_funcionario": 1, "nome": "João", "matricula": "A123", "cpf": "12345678900", "grupo": "Admin", "telefone": "11999999999"},
            {"id_funcionario": 2, "nome": "Maria", "matricula": "B456", "cpf": "98765432100", "grupo": "Vendas", "telefone": "11888888888"}
        ]), 200

    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_FUNCIONARIO)
    return jsonify(response_data), status_code


@bp_funcionario.route('/one', methods=['GET'])
def get_funcionario():
    id_funcionario = request.args.get('id_funcionario')
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({
            "id_funcionario": int(id_funcionario),
            "nome": "João da Silva",
            "matricula": "A123",
            "cpf": "12345678900",
            "grupo": "Admin",
            "telefone": "11999999999"
        }), 200

    return Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")


@bp_funcionario.route('/', methods=['POST'])
def create_funcionario():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    data['senha'] = bcrypt.generate_password_hash(data['senha']).decode('utf-8')

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": "Funcionário criado com sucesso (mock)", "data": data}), 201

    return Funcoes.make_api_request('post', API_ENDPOINT_FUNCIONARIO, data=data)


@bp_funcionario.route('/', methods=['PUT'])
def update_funcionario():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['id_funcionario', 'nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": f"Funcionário {data['id_funcionario']} atualizado (mock)", "data": data}), 200

    return Funcoes.make_api_request('put', f"{API_ENDPOINT_FUNCIONARIO}{data['id_funcionario']}", data=data)


@bp_funcionario.route('/', methods=['DELETE'])
def delete_funcionario():
    id_funcionario = request.args.get('id_funcionario')
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"message": f"Funcionário {id_funcionario} removido com sucesso (mock)"}), 200

    return Funcoes.make_api_request('delete', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")


@bp_funcionario.route('/cpf', methods=['GET'])
def validate_cpf():
    cpf = request.args.get('cpf')
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        return jsonify({"existe": cpf == "12345678900"}), 200

    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}cpf/{cpf}")
    return jsonify(response_data[0] if isinstance(response_data, list) and response_data else {}), status_code


@bp_funcionario.route('/login', methods=['POST'])
def validar_login():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['cpf', 'senha']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    if API_USERNAME_TOKEN.startswith("@"):
        if data['cpf'] == "12345678900" and data['senha'] == "123":
            return jsonify({
                "id_funcionario": 1,
                "nome": "João",
                "grupo": "Admin"
            }), 200
        else:
            return jsonify({"error": "Credenciais inválidas (mock)"}), 401

    return Funcoes.make_api_request('post', f"{API_ENDPOINT_FUNCIONARIO}login/", data=data)


# ---------------- PDF Relatórios -----------------
def _gerar_pdf_lista(funcionarios, titulo):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    try:
        pdf.drawImage("static/logo.png", width - 120, height - 70, width=80, height=40, preserveAspectRatio=True)
    except Exception as e:
        print("[ERRO] Falha ao carregar logo:", e)

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(40, height - 50, titulo)

    y = height - 100
    pdf.setFont("Helvetica", 12)
    for func in funcionarios:
        linha = f"{func.get('id_funcionario', '')} - {func.get('nome', '')} - {func.get('grupo', '')}"
        pdf.drawString(40, y, linha)
        y -= 20
        if y < 50:
            pdf.showPage()
            y = height - 50

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer


@bp_funcionario.route('/relatorio', methods=['GET'])
def relatorio_funcionarios():
    data, status = get_funcionarios()
    if status != 200:
        return jsonify(data), status
    buffer = _gerar_pdf_lista(data.json, 'Relatório de Funcionários')
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name='funcionarios.pdf')


@bp_funcionario.route('/<int:id_funcionario>/ficha', methods=['GET'])
def ficha_funcionario(id_funcionario):
    data, status = get_funcionario()
    if status != 200 or not data:
        return jsonify(data), status
    buffer = _gerar_pdf_lista([data.json], 'Ficha do Funcionário')
    nome = data.json.get('nome', 'funcionario')
    filename = f"ficha_{nome}.pdf"
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=filename)


@bp_funcionario.route('/grupo/<grupo>/relatorio', methods=['GET'])
def relatorio_por_grupo(grupo):
    if API_USERNAME_TOKEN.startswith("@"):
        data = [
            {"id_funcionario": 1, "nome": "João", "grupo": grupo},
            {"id_funcionario": 2, "nome": "Maria", "grupo": grupo}
        ]
        buffer = _gerar_pdf_lista(data, f'Relatório do Grupo {grupo}')
        return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f"grupo_{grupo}.pdf")

    params = {'grupo': grupo}
    data, status = Funcoes.make_api_request('get', API_ENDPOINT_FUNCIONARIO, params=params)
    if status != 200:
        return jsonify(data), status
    buffer = _gerar_pdf_lista(data, f'Relatório do Grupo {grupo}')
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f"grupo_{grupo}.pdf")
