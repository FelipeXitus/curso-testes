import { describe, test, after } from 'node:test';
import request from 'supertest';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';
import { criarLivro } from '#factories/livro.factory.js';
import { criarAppTeste } from '#testutils/create-test-app.js';

describe('Buscar Livro por ID', () => {
  const app = criarAppTeste();
  after(async () => {
    await conexao.destroy();
  });

  test('Retorna os dados de um livro existente (200)', async () => {
    // Primeiro, cadastramos um livro para garantir que exista um ID válido
    const livro = await criarLivro();

    // Segundo, buscamos o livro pelo ID
    await request(app)
      .get(`/livros/${livro.id}`)
      .expect(200)
      .expect((response) => {
        // Terceiro, verificamos se os dados retornados estão corretos
        const dadosResposta = response.body;
        assert.strictEqual(dadosResposta.id, livro.id);
        assert.strictEqual(dadosResposta.titulo, livro.titulo);
        assert.strictEqual(dadosResposta.paginas, livro.paginas);
      });
  });

  test('Retorna um erro quando o livro não existe (404).', async () => {
    await request(app)
      .get('/livros/9999')
      .expect(404)
      .expect((response) => {
        const codigoErro = response.body.type;
        assert.strictEqual(codigoErro, 'NOT_FOUND');
      });
  });
});