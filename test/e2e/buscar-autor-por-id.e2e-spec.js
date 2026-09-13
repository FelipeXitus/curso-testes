import { describe, test, after } from 'node:test';
import request from 'supertest';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';
import { criarAppTeste } from '#testutils/create-test-app.js';

describe('Buscar Autor por ID', () => {
  const app = criarAppTeste();
  after(async () => {
    await conexao.destroy();
  });

  test('Retorna os dados de um autor existente (200)', async () => {
    // Primeiro, cadastramos um autor para garantir que exista um ID válido
    const respostaCadastro = await request(app)
      .post('/autores')
      .send({
        nome: 'J.R.R. Tolkien',
        nacionalidade: 'Inglesa',
      })
      .expect(201);
    const idAutor = respostaCadastro.body.content.id;

    // Segundo, buscamos o autor pelo ID
    await request(app)
      .get(`/autores/${idAutor}`)
      .expect(200)
      .expect((response) => {
        // Terceiro, verificamos se os dados retornados estão corretos
        const dadosResposta = response.body;
        assert.strictEqual(dadosResposta.id, idAutor);
        assert.strictEqual(dadosResposta.nome, 'J.R.R. Tolkien');
        assert.strictEqual(dadosResposta.nacionalidade, 'Inglesa');
      });
  });

  test('Retorna os dados de um autor existente (200) (Usando Banco de Dados)', async () => {
    // Primeiro, cadastramos um autor para garantir que exista um ID válido
    const resultado = await conexao('autores').insert(
      {
        nome: 'J.R.R. Tolkien',
        nacionalidade: 'Inglesa',
      },
      'id',
    );
    const idAutor = resultado[0].id;

    // Segundo, buscamos o autor pelo ID
    await request(app)
      .get(`/autores/${idAutor}`)
      .expect(200)
      .expect((response) => {
        // Terceiro, verificamos se os dados retornados estão corretos
        const dadosResposta = response.body;
        assert.strictEqual(dadosResposta.id, idAutor);
        assert.strictEqual(dadosResposta.nome, 'J.R.R. Tolkien');
        assert.strictEqual(dadosResposta.nacionalidade, 'Inglesa');
      });
  });

  test('Retorna um erro quando o autor não existe (404).', async () => {
    await request(app)
      .get('/autores/9999')
      .expect(404)
      .expect((response) => {
        const codigoErro = response.body.type;
        assert.strictEqual(codigoErro, 'NOT_FOUND');
      });
  });
});