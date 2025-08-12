from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
import os

app = Flask(__name__)
CORS(app) # Habilita CORS para permitir requisições do frontend JavaScript

# Carregar o classificador de rostos pré-treinado do OpenCV
# O arquivo haarcascade pode ser baixado de:
# https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml
# Salve-o na mesma pasta do app.py
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# --- Simulação de um banco de dados para os rostos cadastrados ---
# Em uma aplicação real, você usaria um banco de dados persistente.
known_faces = {}

@app.route('/', methods=['GET'])
def index():
    return "Serviço de Reconhecimento Facial Harpya está no ar com OpenCV!"

# Endpoint para cadastrar um novo rosto para um usuário
@app.route('/cadastro-facial/<string:id_usuario>', methods=['POST'])
def cadastro_facial(id_usuario):
    try:
        data = request.json
        imagem_base64 = data.get('imagem')

        if not imagem_base64:
            return jsonify({"success": False, "message": "Imagem em Base64 não fornecida."}), 400

        # Decodifica a imagem
        imagem_bytes = base64.b64decode(imagem_base64.split(',')[1])
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        imagem = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Converte para tons de cinza e detecta o rosto
        gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
        rostos = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(rostos) == 0:
            return jsonify({"success": False, "message": "Nenhum rosto encontrado na imagem."}), 400

        # Salva o primeiro rosto detectado (área retangular)
        (x, y, w, h) = rostos[0]
        known_faces[id_usuario] = gray[y:y+h, x:x+w].tolist()

        print(f"Rosto cadastrado com sucesso para o usuário ID: {id_usuario}")
        return jsonify({"success": True, "message": "Rosto cadastrado com sucesso!"}), 201

    except Exception as e:
        print(f"Erro no cadastro facial: {str(e)}")
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

# Endpoint para realizar o login com reconhecimento facial
@app.route('/login-facial', methods=['POST'])
def login_facial():
    try:
        data = request.json
        imagem_base64 = data.get('imagem')

        if not imagem_base64:
            return jsonify({"success": False, "message": "Imagem em Base64 não fornecida."}), 400

        # Decodifica a imagem
        imagem_bytes = base64.b64decode(imagem_base64.split(',')[1])
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        imagem = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Converte para tons de cinza e detecta o rosto
        gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
        rostos_login = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(rostos_login) == 0:
            return jsonify({"success": False, "message": "Nenhum rosto detectado na imagem."}), 400

        (x, y, w, h) = rostos_login[0]
        rosto_login = gray[y:y+h, x:x+w]

        # Compara com os rostos conhecidos (usando uma simples comparação de pixels)
        # Esta é uma comparação básica e pode não ser 100% precisa.
        # Em uma aplicação real, você usaria um algoritmo de comparação mais avançado.
        for id_usuario, rosto_conhecido_list in known_faces.items():
            rosto_conhecido = np.array(rosto_conhecido_list, dtype=np.uint8)

            # Redimensiona para o mesmo tamanho para comparação
            rosto_conhecido_redimensionado = cv2.resize(rosto_conhecido, (rosto_login.shape[1], rosto_login.shape[0]))

            diferenca = cv2.absdiff(rosto_login, rosto_conhecido_redimensionado)
            media_diferenca = np.mean(diferenca)

            # Se a média da diferença for menor que um valor limite, consideramos uma correspondência
            if media_diferenca < 50:
                print(f"Login bem-sucedido para o usuário ID: {id_usuario}")
                return jsonify({"success": True, "id_usuario": id_usuario}), 200

        print("Login falhou: Rosto não reconhecido.")
        return jsonify({"success": False, "message": "Rosto não reconhecido."}), 401

    except Exception as e:
        print(f"Erro no login facial: {str(e)}")
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

if __name__ == '__main__':
    # A URL do arquivo haarcascade é:
    # https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml
    # Você deve baixar este arquivo e salvá-lo na mesma pasta do app.py
    if not os.path.exists('haarcascade_frontalface_default.xml'):
        print("AVISO: O arquivo haarcascade_frontalface_default.xml não foi encontrado.")
        print("Por favor, baixe-o do link acima e salve na mesma pasta do app.py")

    app.run(port=5000, debug=True)