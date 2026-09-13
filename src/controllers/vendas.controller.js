import Venda from '#models/venda.js';

export class VendasController {
  constructor(databaseConnection, vendasService) {
    Venda.configurarDB(databaseConnection);
    this.vendasService = vendasService;
  }

  async registrarVenda(req, res) {
    const { idLivro, modoPagamento, valor } = req.body;

    if (!idLivro || !modoPagamento || valor == null) {
      return res.status(400).json({
        message: 'Dados inválidos para registro de venda',
        type: 'INVALID_DATA',
      });
    }

    try {
      const resultado = await this.vendasService.registrarVenda({
        idLivro,
        modoPagamento,
        valor,
      });

      return res.status(201).json({
        message: 'venda registrada',
        content: {
          id: resultado.id,
          idLivro: resultado.livro_id,
          valor: resultado.valor,
          modoPagamento: resultado.tipo_pagamento,
          createdAt: resultado.created_at,
          updatedAt: resultado.updated_at,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
    }
  }
}