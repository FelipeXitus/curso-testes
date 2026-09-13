import Autor from '#models/autor.js';

export class AutoresController {
  constructor(databaseConnection) {
    Autor.configurarDB(databaseConnection);
  }

  async listarAutores(req, res) {
    try {
      const resulado = await Autor.pegarAutores();
      res.status(200).send(resulado);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async buscarAutorPorId(req, res) {
    const { id } = req.params;
    try {
      const resultado = await Autor.pegarPeloId(id);
      if (!resultado) {
        return res.status(404).json({ message: 'Autor não encontrado', type: 'NOT_FOUND' });
      }
      res.status(200).send(resultado);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async cadastrarAutor(req, res) {
    const { body } = req;
    const autor = new Autor(body);
    if (!autor.nome || !autor.nacionalidade) {
      return res.status(400).json({ message: 'Dados inválidos para cadastro de autor', type: 'INVALID_DATA' });
    }
    try {
      const resposta = await autor.salvar(autor);
      return res
        .status(201)
        .json({ message: 'autor criado', content: resposta });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
    }
  }
}
