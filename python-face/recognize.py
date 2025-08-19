import cv2
import os
import json

TRAINER_FILE = os.path.join("trainer", "trainer.yml")
LABELS_FILE = "labels.json"

# Verifica se o modelo existe
if not os.path.exists(TRAINER_FILE):
    raise RuntimeError("Modelo não encontrado. Rode train_recognizer.py primeiro.")

# Carrega o reconhecedor
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(TRAINER_FILE)

# Carrega labels
with open(LABELS_FILE, "r", encoding="utf-8") as f:
    labels = json.load(f)
labels = {int(k): v for k, v in labels.items()}

# Inicializa câmera e cascade
cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

print("Reconhecimento iniciado... Pressione 'q' para sair.")
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    for (x, y, w, h) in faces:
        roi = gray[y:y+h, x:x+w]
        roi = cv2.resize(roi, (200, 200))
        label, confidence = recognizer.predict(roi)

        if confidence < 80:
            name = labels.get(label, "Desconhecido")
            text = f"{name} ({confidence:.1f})"
        else:
            text = f"Desconhecido ({confidence:.1f})"

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, text, (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    cv2.imshow("Reconhecimento Facial", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
