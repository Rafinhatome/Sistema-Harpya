import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS # Importe a biblioteca CORS
from ultralytics import YOLO
import dlib
import face_recognition

# Inicializa o Flask
app = Flask(__name__)
CORS(app) # Habilite o CORS para todas as rotas

# Carrega o modelo YOLO pré-treinado para detecção de rostos
# Vamos usar o 'yolov8n-face.pt' que é otimizado para essa tarefa
model = YOLO('src/main/python/models/yolov8n.pt')

# Endpoint para receber e processar a imagem
@app.route('/detectar_rosto', methods=['POST'])
def detectar_rosto():
    try:
        # Recebe o JSON com a imagem em base64
        data = request.get_json()
        if 'imagem' not in data:
            return jsonify({'erro': 'Nenhuma imagem fornecida'}), 400

        # Decodifica a imagem de base64 para um array de bytes
        imagem_bytes = base64.b64decode(data['imagem'])
        # Converte o array de bytes para um formato que o OpenCV entende
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Roda a detecção de rosto com o YOLO
        resultados = model.predict(img)

        # Checa se algum rosto foi detectado
        if len(resultados[0].boxes) > 0:
            return jsonify({'status': 'sucesso', 'mensagem': 'Rosto detectado com sucesso!'}), 200
        else:
            return jsonify({'status': 'falha', 'mensagem': 'Nenhum rosto foi detectado.'}), 404

    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# --- NOVO ENDPOINT DE VERIFICAÇÃO FACIAL ---
@app.route('/verificar_rosto', methods=['POST'])
def verificar_rosto():
    try:
        data = request.get_json()
        
        # O 'embedding_salvo' é o que vem do seu banco de dados Java
        # O 'embedding_atual' é o que vem da imagem capturada no momento do login
        if 'embedding_salvo' not in data or 'embedding_atual' not in data:
            return jsonify({'status': 'falha', 'mensagem': 'Embeddings são obrigatórios'}), 400

        embedding_salvo = np.array(data['embedding_salvo'])
        embedding_atual = np.array(data['embedding_atual'])

        # Compara as faces usando a distância euclidiana.
        # A função compare_faces retorna True se a distância for menor que o limiar (0.6 é o padrão)
        # 0.6 é um valor típico, mas pode ser ajustado para ser mais ou menos rigoroso.
        match = face_recognition.compare_faces([embedding_salvo], embedding_atual)
        
        if match[0]:
            return jsonify({'status': 'sucesso', 'mensagem': 'Rosto verificado com sucesso!'}), 200
        else:
            return jsonify({'status': 'falha', 'mensagem': 'Rosto não corresponde'}), 401

    except Exception as e:
        return jsonify({'status': 'falha', 'mensagem': 'Erro na verificação: ' + str(e)}), 500


# Executa o servidor Flask
if __name__ == '__main__':
    # 'debug=True' é útil para desenvolvimento. Mude para 'False' em produção.
    app.run(host='0.0.0.0', port=5000, debug=True)