export function calcularValorVenda(valor, modoPagamento) {
    const taxas = {
        CARTAO_CREDITO: 1.05,
        CARTAO_DEBITO: 1.02,
        PIX: 0.95,
        BOLETO: 1,
        DINHEIRO: 1
    };
    
    const tipoTaxa = taxas[modoPagamento];
    if (!tipoTaxa) {
        throw new Error(`Modo de pagamento inválido: ${modoPagamento}`);
    }
    return Math.round(valor * tipoTaxa);
}