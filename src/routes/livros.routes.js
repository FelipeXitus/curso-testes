import { Router } from 'express';
import { LivrosController } from '#controllers/livros.controller.js';
import db from '#db/singleton-connection.js';
const router = Router();

const livrosController = new LivrosController(db);

router.get('/livros', livrosController.listarLivros.bind(livrosController));
router.get(
  '/livros/:id',
  livrosController.buscarLivroPorId.bind(livrosController),
);
router.post('/livros', livrosController.cadastrarLivro.bind(livrosController));

export default router;