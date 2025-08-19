from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import face_recognition
import os

app = Flask(__name__)
CORS(app)

# Pasta para salvar encodings
ENCODINGS_DIR = "encodings"
os.makedirs(ENCODINGS_DIR, exist_ok=True)

# -------------------------
# Funções auxiliares
# -------------------------
def salvar_encoding(id_usuario, encoding):
    """Salva encoding em arquivo .npy"""
    np.save(os.path.join(ENCODINGS_DIR, f"{id_usuario}.npy"), encoding)

def carregar_encoding(id_usuario):
    """Carrega encoding salvo"""
    caminho = os.path.join(ENCODINGS_DIR, f"{id_usuario}.npy")
    if os.path.exists(caminho):
        return np.load(caminho)
    return None

def carregar_todos_encodings():
    """Carrega todos os encodings salvos"""
    encodings = {}
    for arquivo in os.listdir(ENCODINGS_DIR):
        if arquivo.endswith(".npy"):
            id_usuario = arquivo.replace(".npy", "")
            encodings[id_usuario] = np.load(os.path.join(ENCODINGS_DIR, arquivo))
    return encodings

def decode_image(imagem_base64):
    """Decodifica Base64 em array NumPy"""
    imagem_bytes = base64.b64decode(imagem_base64.split(',')[1])
    nparr = np.frombuffer(imagem_bytes, np.uint8)
    return face_recognition.load_image_file(nparr)


# -------------------------
# Endpoints
# -------------------------

@app.route("/", methods=["GET"])
def index():
    return "🚀 Serviço de Reconhecimento Facial Harpya está no ar com Face_Recognition!"


@app.route("/cadastro-facial/<string:id_usuario>", methods=["POST"])
def cadastro_facial(id_usuario):
    try:
        data = request.json
        imagem_base64 = data.get("imagem")

        if not imagem_base64:
            return jsonify({"success": False, "message": "Imagem em Base64 não fornecida."}), 400

        # Decodifica a imagem
        imagem_bytes = base64.b64decode(imagem_base64.split(',')[1])
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        imagem = face_recognition.load_image_file(nparr)

        # Detecta rostos e gera encodings
        encodings = face_recognition.face_encodings(imagem)
        if len(encodings) == 0:
            return jsonify({"success": False, "message": "Nenhum rosto detectado."}), 400

        # Salva o primeiro rosto detectado
        salvar_encoding(id_usuario, encodings[0])

        return jsonify({"success": True, "message": f"Rosto cadastrado com sucesso para usuário {id_usuario}!"}), 201

    except Exception as e:
        print(f"Erro no cadastro facial: {str(e)}")
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500


@app.route("/login-facial", methods=["POST"])
def login_facial():
    try:
        data = request.json
        imagem_base64 = data.get("imagem")

        if not imagem_base64:
            return jsonify({"success": False, "message": "Imagem em Base64 não fornecida."}), 400

        # Decodifica a imagem recebida
        imagem_bytes = base64.b64decode(imagem_base64.split(',')[1])
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        imagem = face_recognition.load_image_file(nparr)

        # Extrai encoding do rosto
        encodings_login = face_recognition.face_encodings(imagem)
        if len(encodings_login) == 0:
            return jsonify({"success": False, "message": "Nenhum rosto detectado."}), 400

        encoding_login = encodings_login[0]

        # Carrega encodings cadastrados
        known_faces = carregar_todos_encodings()

        # Compara com cada usuário
        for id_usuario, encoding_conhecido in known_faces.items():
            results = face_recognition.compare_faces([encoding_conhecido], encoding_login, tolerance=0.5)

            if results[0]:  # match encontrado
                return jsonify({"success": True, "id_usuario": id_usuario}), 200

        return jsonify({"success": False, "message": "Rosto não reconhecido."}), 401

    except Exception as e:
        print(f"Erro no login facial: {str(e)}")
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
