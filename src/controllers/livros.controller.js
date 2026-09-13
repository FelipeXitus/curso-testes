import Livro from '#models/livro.js';
import { LivrosService } from '#services/livros.service.js';

export class LivrosController {
  constructor(databaseConnection) {
    Livro.configurarDB(databaseConnection);
    this.livrosService = new LivrosService(databaseConnection);
  }

  async listarLivros(req, res) {
    try {
      const resultado = await this.livrosService.listarLivros();
      res.status(200).json(resultado);
    } catch (err) {
      console.error(err);
      res.status(500).json(err.message);
    }
  }

  async buscarLivroPorId(req, res) {
    const { id } = req.params;
    try {
      const resultado = await this.livrosService.buscarLivroPorId(id);
      if (!resultado) {
        return res
          .status(404)
          .json({ message: 'Livro não encontrado', type: 'NOT_FOUND' });
      }
      res.status(200).send(resultado);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async cadastrarLivro(req, res) {
    const { body } = req;
    const livro = new Livro(body);
    try {
      const resposta = await livro.salvar(livro);
      return res
        .status(201)
        .json({ message: 'livro criado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}