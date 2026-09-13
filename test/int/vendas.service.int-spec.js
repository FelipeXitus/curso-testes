import test, { after, describe, mock } from 'node:test';
import conexao from '#db/singleton-connection.js';
import { criarLivro } from '#factories/livro.factory.js';
import { VendasService } from '#services/vendas.service.js';
import assert from 'node:assert';
import { assertMock } from '#testutils/mock.assertions.js';
import { criarEditora } from '#factories/editora.factory.js';

describe('VendasService', () => {
  after(async () => {
    await conexao.destroy();
  });

  describe('registrarVenda', () => {
    test('Registra uma venda com sucesso e envia email para a editora', async () => {
      // Arrange
      const emailGatewayMock = {
        enviarEmail: mock.fn(),
      };

      const estoqueGatewayMock = {
        temEstoque: mock.fn(() => Promise.resolve(true)),
      };

      const sut = new VendasService(
        conexao,
        emailGatewayMock,
        estoqueGatewayMock,
      );
      const editora = await criarEditora({
        email: 'editora@teste.com',
      });
      const livro = await criarLivro({
        titulo: 'Livro para Venda',
        editora_id: editora.id,
      });

      // Act
      const resposta = await sut.registrarVenda({
        idLivro: livro.id,
        modoPagamento: 'PIX',
        valor: 100,
      });

      // Assert
      assert.strictEqual(resposta.livro_id, livro.id);
      assert.strictEqual(resposta.valor, "95.00");
      assert.strictEqual(resposta.tipo_pagamento, 'PIX');
      assertMock(emailGatewayMock.enviarEmail).wasCalledWith({
        destinatario: 'editora@teste.com',
        remetente: 'no-reply@livraria.com',
        assunto: 'Nova venda registrada',
        mensagem:
          'Uma nova venda do livro "Livro para Venda" foi registrada com o valor de R$ 95.',
      });
    });

    test('Lança um erro quando o livro não tem estoque disponível', async () => {
      // Arrange
      const emailGatewayMock = {
        enviarEmail: mock.fn(),
      };
      const estoqueGatewayMock = {
        temEstoque: mock.fn(() => Promise.resolve(false)),
      };

      const sut = new VendasService(
        conexao,
        emailGatewayMock,
        estoqueGatewayMock,
      );

      const livro = await criarLivro({
        titulo: 'Livro para Venda',
      });

      // Act
      const resposta = () =>
        sut.registrarVenda({
          idLivro: livro.id,
          modoPagamento: 'PIX',
          valor: 100,
        });

      // Assert
      assert.rejects(resposta, {
        message: 'Livro sem estoque disponível',
      });
    });
  });
});