export class EstoqueApiGateway {
  async temEstoque(idLivro) {
    // Simula uma chamada a um serviço externo
    const apiEndpoint = `https://livraria.com/api/livros/${idLivro}/estoque`;

    const resposta = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const sucesso = resposta.ok;

    return sucesso;
  }
}