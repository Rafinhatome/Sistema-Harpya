CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  senha_hash VARCHAR(255),
  ativo BOOLEAN,
  criado_em DATETIME
);

CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  cnpj VARCHAR(20) UNIQUE,
  plano VARCHAR(50),
  criado_em DATETIME
);

CREATE TABLE usuarios_empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  empresa_id INT,
  tipo_acesso VARCHAR(50), -- admin, comum, etc.
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE aplicativos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  nome VARCHAR(100),
  icone_url VARCHAR(255),
  criado_em DATETIME,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE credenciais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  aplicativo_id INT,
  login VARCHAR(100),
  senha_criptografada VARCHAR(255),
  atualizado_em DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (aplicativo_id) REFERENCES aplicativos(id)
);

CREATE TABLE autenticacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  data DATETIME,
  ip_origem VARCHAR(45),
  dispositivo VARCHAR(100),
  sucesso BOOLEAN,
  tipo_autenticacao VARCHAR(50), -- facial, senha, multifator
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE biometria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  template_facial_hash TEXT,
  criado_em DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
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
