import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import { AutoresController } from '#controllers/autores.controller.js';
import conexao from '#db/singleton-connection.js';
import { limparBanco } from '#commands/limpar-banco.command.js';

function criarRespostaMock() {
  const res = {
    statusCode: undefined,
    body: undefined,
    status(codigo) {
      this.statusCode = codigo;
      return this;
    },
    json(dados) {
      this.body = dados;
      return this;
    },
    send(dados) {
      this.body = dados;
      return this;
    }
  };
  return res;
}

describe('AutoresController', () => {
  let autoresController;

  beforeEach(async () => {
    autoresController = new AutoresController(conexao);
    await limparBanco();
  });
  after(async () => {
    await conexao.destroy();
  });

  describe('listarAutores', () => {
    test('Retorna status 200 com a lista de autores cadastrados', async () => {
      // Arrange
      await autoresController.cadastrarAutor(
        { body: { nome: 'H.P. Lovecraft', nacionalidade: 'Americana' } },
        criarRespostaMock()
      );
      const res = criarRespostaMock();

      // Act
      await autoresController.listarAutores({}, res);

      // Assert
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.body));
      assert.strictEqual(res.body.length, 1);
      assert.strictEqual(res.body[0].nome, 'H.P. Lovecraft');
    });

    test('Retorna status 200 com uma lista vazia quando não há autores cadastrados', async () => {
      // Arrange
      const res = criarRespostaMock();

      // Act
      await autoresController.listarAutores({}, res);

      // Assert
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body, []);
    });
  });

  describe('buscarAutorPorId', () => {
    test('Retorna status 200 com os dados do autor quando o id existe', async () => {
      // Arrange
      const resCadastro = criarRespostaMock();
      await autoresController.cadastrarAutor(
        { body: { nome: 'J.K. Rowling', nacionalidade: 'Britânica' } },
        resCadastro
      );
      const idAutor = resCadastro.body.content.id;
      const res = criarRespostaMock();

      // Act
      await autoresController.buscarAutorPorId({ params: { id: idAutor } }, res);

      // Assert
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.nome, 'J.K. Rowling');
      assert.strictEqual(res.body.nacionalidade, 'Britânica');
    });

    test('Retorna status 404 quando o id não existe', async () => {
      // Arrange
      const res = criarRespostaMock();

      // Act
      await autoresController.buscarAutorPorId({ params: { id: 9999 } }, res);

      // Assert
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.type, 'NOT_FOUND');
    });
  });

  describe('cadastrarAutor', () => {
    test('Retorna status 201 com os dados do autor criado quando os dados são válidos', async () => {
      // Arrange
      const novoAutor = { nome: 'C.S. Lewis', nacionalidade: 'Britânica' };
      const res = criarRespostaMock();

      // Act
      await autoresController.cadastrarAutor({ body: novoAutor }, res);

      // Assert
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(typeof res.body.content.id, 'number');
      assert.strictEqual(res.body.content.nome, novoAutor.nome);
      assert.strictEqual(res.body.content.nacionalidade, novoAutor.nacionalidade);
    });

    test('Retorna status 400 quando os dados são inválidos', async () => {
      // Arrange
      const res = criarRespostaMock();

      // Act
      await autoresController.cadastrarAutor({ body: { nome: '', nacionalidade: '' } }, res);

      // Assert
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.type, 'INVALID_DATA');
    });
  });
});
