import Venda from '#models/venda.js';
import Livro from '#models/livro.js';
import Editora from '#models/editora.js';
import { calcularValorVenda } from '#domain/calcular-valor-venda.js';
import { EmailGateway } from '#src/gateways/email.gateway.js';
import { EstoqueApiGateway } from '#src/gateways/estoque-api.gateway.js';

export class VendasService {
  constructor(
    databaseConnection,
    emailGateway = new EmailGateway(),
    estoqueGateway = new EstoqueApiGateway(),
  ) {
    Venda.configurarDB(databaseConnection);
    Livro.configurarDB(databaseConnection);
    Editora.configurarDB(databaseConnection);
    this.emailGateway = emailGateway;
    this.estoqueGateway = estoqueGateway;
  }

  async registrarVenda({ idLivro, modoPagamento, valor }) {
    const temEstoque = await this.estoqueGateway.temEstoque(idLivro);

    if (!temEstoque) {
      throw new Error('Livro sem estoque disponível');
    }

    const valorFinal = calcularValorVenda(valor, modoPagamento);

    const venda = new Venda({
      livro_id: idLivro,
      valor: valorFinal,
      tipo_pagamento: modoPagamento,
    });

    const resultado = await venda.salvar();

    const livro = await Livro.pegarPeloId(idLivro);
    const editora = await Editora.pegarPeloId(livro.editora_id);

    await this.emailGateway.enviarEmail({
      remetente: 'no-reply@livraria.com',
      destinatario: editora.email,
      assunto: 'Nova venda registrada',
      mensagem: `Uma nova venda do livro "${livro.titulo}" foi registrada com o valor de R$ ${valorFinal}.`,
    });
    return resultado;
  }
}