import test, { after, beforeEach, describe } from 'node:test';
import { LivrosService } from '#services/livros.service.js';
import { criarLivro } from '../factories/livro.factory.js';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';

describe('LivrosService', () => {
    const sut = new LivrosService(conexao); 

    beforeEach(async () => {
        await conexao('livros').delete();
    });

    after(async () => {
        await conexao.destroy();
    });
    describe('listarLivros', () => {
        test('Retorna lista vazia quando não há livros cadastrados', async () => {
            const resultado = await sut.listarLivros();
            assert.deepStrictEqual(resultado, []);
        });

        test('Retorna lista de livros cadastrados', async () => {
            // Arrange
            const livro1 = await criarLivro({ titulo: 'Livro 1' });
            const livro2 = await criarLivro({ titulo: 'Livro 2' });

            // Act
            const resultado = await sut.listarLivros();

            // Assert
            assert.deepStrictEqual(resultado, [livro1, livro2]);
        });
    });
});