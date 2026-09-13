## Cadastrar um Autor

Rota: (POST) /autores

Cenários:

- Retorna os dados do autor cadastrado quando os dados são válidos (201) ✅

- Retorna um erro ao tentar cadastrar autor com dados inválidos (400) ❌

## Recuperar um Autor

Rota: (GET) /autores/:id

Cenários:

- Retorna os dados de um autor existente (200) ✅

- Retorna um erro quando o autor não existe (404) ✅

## Listar Autores

Rota: (GET) /autores

Cenários:

- Retorna uma lista com os dados dos autores quando existe ao menos um autor cadastrado (200) ✅

- Retorna uma lista vazia quando não existem autores cadastrados (200) ✅

- (hipotético) Retorna um erro quando o usuário não está autenticado (403)