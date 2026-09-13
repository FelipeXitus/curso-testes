import { describe, test, after, beforeEach } from 'node:test';
import request from 'supertest';
import conexao from '#db/singleton-connection.js';
import { criarLivro } from '#factories/livro.factory.js';
import assert from 'node:assert';
import { criarAppTeste } from '#testutils/create-test-app.js';

describe('Listar livros', () => {
  const app = criarAppTeste();
  after(async () => {
    await conexao.destroy();
  });

  beforeEach(async () => {
    await conexao('livros').delete();
  });

  test('Retorna uma lista contendo os dados dos livros quando existe ao menos um livro cadastrado (200).', async () => {
    const oSenhorDosAneis = await criarLivro({ titulo: 'O Senhor dos Anéis' });
    const aGuerraDosTronos = await criarLivro({
      titulo: 'A Guerra dos Tronos',
    });

    await request(app)
      .get('/livros')
      .expect(200)
      .expect((res) => {
        assert.strictEqual(res.body.length, 2);

        const livro1 = res.body[0];
        const livro2 = res.body[1];

        assert.strictEqual(livro1.titulo, oSenhorDosAneis.titulo);
        assert.strictEqual(livro1.id, oSenhorDosAneis.id);

        assert.strictEqual(livro2.titulo, aGuerraDosTronos.titulo);
        assert.strictEqual(livro2.id, aGuerraDosTronos.id);
      });
  });

  test('Retorna uma lista vazia quando não existem livros cadastrados (200).', async () => {
    await request(app).get('/livros').expect(200).expect([]);
  });
});