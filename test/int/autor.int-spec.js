import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import Autor from '#models/autor.js';
import Editora from '#models/editora.js';
import Livro from '#models/livro.js';
import conexao from '#db/singleton-connection.js';
import { limparBanco } from '#commands/limpar-banco.command.js';

describe('Autor', () => {
  beforeEach(async () => {
    Autor.configurarDB(conexao);
    await limparBanco();
  });
  after(async () => {
    await conexao.destroy();
  });

  describe('pegarAutores', () => {
    test('Retorna uma lista de autores', async () => {
      // Arrange
      const autoresEsperados = [
        {
          nome: 'C.S. Lewis',
          nacionalidade: 'Britânica'
        },
        {
          nome: 'J.K. Rowling',
          nacionalidade: 'Britânica'
        },
        {
          nome: 'H.P. Lovecraft',
          nacionalidade: 'Americana'
        }
      ];

      for (const autor of autoresEsperados) {
        await new Autor(autor).salvar();
      }

      // Act
      const autoresBanco = await Autor.pegarAutores();

      // Assert
      assert.ok(Array.isArray(autoresBanco));

      assert.deepStrictEqual(
        autoresBanco.map(({ nome, nacionalidade }) => ({
          nome,
          nacionalidade
        })),
        autoresEsperados
      );
    });
  });

  describe('pegarPeloId', () => {
    test('Retorna o autor correspondente ao id informado', async () => {
      // Arrange
      const autorSalvo = await new Autor({
        nome: 'J.K. Rowling',
        nacionalidade: 'Britânica'
      }).salvar();

      // Act
      const autorEncontrado = await Autor.pegarPeloId(autorSalvo.id);

      // Assert
      assert.strictEqual(autorEncontrado.nome, autorSalvo.nome);
      assert.strictEqual(autorEncontrado.nacionalidade, autorSalvo.nacionalidade);
    });

    test('Retorna undefined quando o id não existe', async () => {
      // Act
      const autorEncontrado = await Autor.pegarPeloId(9999);

      // Assert
      assert.strictEqual(autorEncontrado, undefined);
    });
  });

  describe('criar', () => {
    test('Insere um novo autor no banco e retorna os dados criados', async () => {
      // Arrange
      const autor = new Autor({
        nome: 'H.P. Lovecraft',
        nacionalidade: 'Americana'
      });

      // Act
      const autorCriado = await autor.criar();

      // Assert
      assert.strictEqual(typeof autorCriado.id, 'number');
      assert.strictEqual(autorCriado.nome, autor.nome);
      assert.strictEqual(autorCriado.nacionalidade, autor.nacionalidade);

      const autorNoBanco = await Autor.pegarPeloId(autorCriado.id);
      assert.strictEqual(autorNoBanco.nome, autor.nome);
    });
  });

  describe('atualizar', () => {
    test('Atualiza os dados de um autor existente', async () => {
      // Arrange
      const autorCriado = await new Autor({
        nome: 'C.S. Lewis',
        nacionalidade: 'Britânica'
      }).salvar();
      const autor = new Autor({ ...autorCriado, nacionalidade: 'Irlandesa' });

      // Act
      const [autorAtualizado] = await autor.atualizar(autorCriado.id);

      // Assert
      assert.strictEqual(autorAtualizado.id, autorCriado.id);
      assert.strictEqual(autorAtualizado.nacionalidade, 'Irlandesa');
    });
  });

  describe('excluir', () => {
    test('Remove um autor existente do banco', async () => {
      // Arrange
      const autorCriado = await new Autor({
        nome: 'J.R.R. Tolkien',
        nacionalidade: 'Britânica'
      }).salvar();

      // Act
      await Autor.excluir(autorCriado.id);

      // Assert
      const autorNoBanco = await Autor.pegarPeloId(autorCriado.id);
      assert.strictEqual(autorNoBanco, undefined);
    });
  });

  describe('salvar', () => {
    test('Cria um novo autor quando ele não possui id', async () => {
      // Arrange
      const autor = new Autor({
        nome: 'Agatha Christie',
        nacionalidade: 'Britânica'
      });

      // Act
      const autorSalvo = await autor.salvar();

      // Assert
      assert.strictEqual(typeof autorSalvo.id, 'number');
      assert.strictEqual(autorSalvo.nome, autor.nome);
    });

    test('Atualiza um autor existente quando ele já possui id', async () => {
      // Arrange
      const autorCriado = await new Autor({
        nome: 'George Orwell',
        nacionalidade: 'Britânica'
      }).salvar();
      const autor = new Autor({ ...autorCriado, nome: 'George Orwell Atualizado' });

      // Act
      const [autorSalvo] = await autor.salvar();

      // Assert
      assert.strictEqual(autorSalvo.id, autorCriado.id);
      assert.strictEqual(autorSalvo.nome, 'George Orwell Atualizado');
    });
  });

  describe('pegarLivrosPorAutor', () => {
    test('Retorna os livros associados a um autor', async () => {
      // Arrange
      Editora.configurarDB(conexao);
      Livro.configurarDB(conexao);

      const autorCriado = await new Autor({
        nome: 'J.K. Rowling',
        nacionalidade: 'Britânica'
      }).salvar();
      const editoraCriada = await new Editora({
        nome: 'Rocco',
        cidade: 'Rio de Janeiro',
        email: 'contato@rocco.com.br'
      }).salvar();
      const livroCriado = await new Livro({
        titulo: 'Harry Potter e a Pedra Filosofal',
        paginas: 223,
        autor_id: autorCriado.id,
        editora_id: editoraCriada.id
      }).salvar();

      // Act
      const livrosDoAutor = await Autor.pegarLivrosPorAutor(autorCriado.id);

      // Assert
      assert.strictEqual(livrosDoAutor.length, 1);
      assert.strictEqual(livrosDoAutor[0].id, livroCriado.id);
      assert.strictEqual(livrosDoAutor[0].titulo, livroCriado.titulo);
    });

    test('Retorna uma lista vazia quando o autor não possui livros', async () => {
      // Arrange
      const autorCriado = await new Autor({
        nome: 'H.P. Lovecraft',
        nacionalidade: 'Americana'
      }).salvar();

      // Act
      const livrosDoAutor = await Autor.pegarLivrosPorAutor(autorCriado.id);

      // Assert
      assert.deepStrictEqual(livrosDoAutor, []);
    });
  });
});