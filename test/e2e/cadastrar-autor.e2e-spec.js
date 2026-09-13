import { describe, test, after } from 'node:test';
import request from 'supertest';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';
import { criarAppTeste } from '#testutils/create-test-app.js';

describe('Cadastrar Autor', () => {
  const app = criarAppTeste();
  after(async () => {
    await conexao.destroy();
  });

  test('Retorna os dados do autor cadastrado quando os dados são válidos (201).', async () => {
    const response = await request(app)
      .post('/autores')
      .send({
        nome: 'H.P. Lovecraft Novo',
        nacionalidade: 'Ingles',
      })
      .expect(201)
      .expect((response) => {
        const dadosResposta = response.body.content;
        assert.strictEqual(typeof dadosResposta.id, 'number');
        assert.strictEqual(dadosResposta.nome, 'H.P. Lovecraft Novo');
        assert.strictEqual(dadosResposta.nacionalidade, 'Ingles');
      })
      .then((response) => response.body.content);

    const autorNoBanco = await conexao('autores')
      .where({ id: response.id })
      .first();

    assert.ok(autorNoBanco);
    assert.strictEqual(autorNoBanco.nome, 'H.P. Lovecraft Novo');
    assert.strictEqual(autorNoBanco.nacionalidade, 'Ingles');
  });

  test('Retorna um erro ao tentar cadastrar um autor com dados inválidos (400).', async () => {
    await request(app)
      .post('/autores')
      .send({
        nome: '',
        nacionalidade: '',
      })
      .expect(400)
      .expect((response) => {
        const codigoErro = response.body.type;
        assert.strictEqual(codigoErro, 'INVALID_DATA');
      });
  });
});