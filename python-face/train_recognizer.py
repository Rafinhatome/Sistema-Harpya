import cv2
import os
import numpy as np

DATASET_DIR = "dataset"
TRAINER_DIR = "trainer"
os.makedirs(TRAINER_DIR, exist_ok=True)

# Listas para imagens e labels
faces = []
labels = []

# Lê todas as imagens do dataset
for fname in os.listdir(DATASET_DIR):
    if not fname.lower().endswith(".jpg"):
        continue
    parts = fname.split(".")
    if len(parts) < 3:
        continue

    label = int(parts[1])
    path = os.path.join(DATASET_DIR, fname)
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        continue

    faces.append(img)
    labels.append(label)

if len(faces) == 0:
    raise RuntimeError("Nenhuma imagem encontrada no dataset. Rode capture_images.py primeiro.")

# Cria e treina o reconhecedor
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces, np.array(labels))

# Salva o modelo treinado
trainer_path = os.path.join(TRAINER_DIR, "trainer.yml")
recognizer.write(trainer_path)
print(f"Modelo salvo em {trainer_path}")
