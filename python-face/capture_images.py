import cv2
import os
import json

# Pastas e arquivos
DATASET_DIR = "dataset"
LABELS_FILE = "labels.json"
os.makedirs(DATASET_DIR, exist_ok=True)

# Carrega labels existentes ou cria um novo
if os.path.exists(LABELS_FILE):
    with open(LABELS_FILE, "r", encoding="utf-8") as f:
        labels = json.load(f)
else:
    labels = {}

# Pergunta o nome da pessoa
name = input("Nome da pessoa: ").strip()

# Define label (número) para a pessoa
inv = {v: k for k, v in labels.items()}
if name in inv:
    label = int(inv[name])
else:
    label = max([int(k) for k in labels.keys()], default=-1) + 1
    labels[str(label)] = name
    with open(LABELS_FILE, "w", encoding="utf-8") as f:
        json.dump(labels, f, ensure_ascii=False, indent=2)

# Inicializa a câmera e o detector
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Não foi possível acessar a câmera.")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
count = 0
TARGET = 50  # Quantas fotos tirar

print("Capturando imagens... Pressione 'q' para sair.")
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    for (x, y, w, h) in faces:
        face_img = gray[y:y+h, x:x+w]
        face_img = cv2.resize(face_img, (200, 200))
        file_path = os.path.join(DATASET_DIR, f"user.{label}.{count}.jpg")
        cv2.imwrite(file_path, face_img)
        count += 1

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, f"{name} {count}/{TARGET}", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    cv2.imshow("Captura de Imagens", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    if count >= TARGET:
        break

cap.release()
cv2.destroyAllWindows()
print(f"Captura finalizada: {count} imagens salvas em {DATASET_DIR}")
