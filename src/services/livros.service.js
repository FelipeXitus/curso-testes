import Livro from '#models/livro.js';

export class LivrosService {
  constructor(databaseConnection) {
    Livro.configurarDB(databaseConnection);
  }

  async listarLivros() {
    const resultado = await Livro.pegarLivros();
    return resultado;
  }

  async buscarLivroPorId(id) {
    const resultado = await Livro.pegarPeloId(id);
    return resultado;
  }
}