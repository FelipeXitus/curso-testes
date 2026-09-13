import { describe, test } from 'node:test';
import assert from 'node:assert';
import { calcularValorVenda } from '#domain/calcular-valor-venda.js';

describe('calcularValorVenda', () => {
    const casosTeste = [
        { valor: 100, modoPagamento: 'BOLETO', valorEsperado: Math.round(100 * 1) },
        { valor: 100, modoPagamento: 'DINHEIRO', valorEsperado: Math.round(100 * 1) },
        { valor: 100, modoPagamento: 'CARTAO_CREDITO', valorEsperado: Math.round(100 * 1.05) },
        { valor: 100, modoPagamento: 'CARTAO_DEBITO', valorEsperado: Math.round(100 * 1.02) },
        { valor: 100, modoPagamento: 'PIX', valorEsperado: Math.round(100 * 0.95) }
    ];

    casosTeste.forEach(({ valor, modoPagamento, valorEsperado }) => {
        test(`deve calcular o valor corretamente para ${modoPagamento}, quando valor é ${valor}, o valor de venda é ${valorEsperado}`, () => {
            const valorCalculado = calcularValorVenda(valor, modoPagamento);
            assert.strictEqual(valorCalculado, valorEsperado);
        });
    });

    test('deve lançar um erro para modo de pagamento inválido', () => {
        const valor = 100;
        const modoPagamento = 'CHEQUE';
        assert.throws(() => calcularValorVenda(valor, modoPagamento), {
            message: 'Modo de pagamento inválido: CHEQUE'
        });
    });
});