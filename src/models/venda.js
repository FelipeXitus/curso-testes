class Venda {
  static db;

  static configurarDB(db) {
    this.db = db;
  }

  constructor({ id, livro_id, valor, tipo_pagamento, created_at, updated_at }) {
    this.id = id;
    this.livro_id = livro_id;
    this.valor = valor;
    this.tipo_pagamento = tipo_pagamento;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static calcularValorFinal(valor, modoPagamento) {
    const taxas = {
      CARTAO_CREDITO: 1.05,
      CARTAO_DEBITO: 1.02,
      BOLETO: 1,
      DINHEIRO: 1,
      PIX: 0.95,
    };

    const multiplicador = taxas[modoPagamento];
    if (multiplicador === undefined) {
      throw new Error(`Modo de pagamento inválido: ${modoPagamento}`);
    }

    return Math.round(valor * multiplicador);
  }

  async criar() {
    const resultado = await Venda.db('vendas').insert(this, '*');
    return resultado[0];
  }

  async salvar() {
    const resultado = await this.criar();
    return resultado;
  }
}

export default Venda;