CREATE TABLE login (
  id_login BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_usuario BIGINT,
  nome VARCHAR(255),
  localizacao VARCHAR(255),
  ip VARCHAR(255),
  email VARCHAR(255),
  data_hora DATETIME(6)
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  senha_hash VARCHAR(255),
  ativo BOOLEAN,
  criado_em DATETIME
  face_embedding VARCHAR(2048)
);

CREATE TABLE enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(20),
  tipo VARCHAR(50), -- residencial, comercial, etc.
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);