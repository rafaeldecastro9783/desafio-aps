CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  logradouro VARCHAR(255),
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  uf VARCHAR(2),
  complemento VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(50)
);

-- Exemplo de inserção
INSERT INTO clients (
  cnpj, nome, nome_fantasia, cep, logradouro,
  bairro, cidade, uf, complemento, email, telefone
) VALUES (
  '12345678000199', 'Empresa Exemplo', 'Exemplo LTDA', '01001000',
  'Praça da Sé', 'Sé', 'São Paulo', 'SP', 'Sala 1', 'contato@exemplo.com', '11999999999'
);
