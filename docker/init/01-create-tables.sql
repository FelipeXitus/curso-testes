-- Create tables in livraria database (default POSTGRES_DB)
-- This database will be used as a template for the test database

CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nacionalidade VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS editoras (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    paginas INTEGER,
    autor_id INTEGER NOT NULL,
    editora_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE,
    CONSTRAINT fk_editora FOREIGN KEY (editora_id) REFERENCES editoras(id) ON DELETE CASCADE
);

CREATE TYPE tipo_pagamento AS ENUM ('CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'DINHEIRO');

CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    tipo_pagamento tipo_pagamento NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_livros_autor_id ON livros(autor_id);
CREATE INDEX IF NOT EXISTS idx_livros_editora_id ON livros(editora_id);
CREATE INDEX IF NOT EXISTS idx_vendas_livro_id ON vendas(livro_id);
