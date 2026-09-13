import { Router } from 'express';
import { VendasController } from '#controllers/vendas.controller.js';
import { VendasService } from '#services/vendas.service.js';
import db from '#db/singleton-connection.js';

export default function vendasRoutes(dependencias) {
  const router = Router();

  const vendasService = new VendasService(
    db,
    dependencias.emailGateway,
    dependencias.estoqueGateway,
  );
  const vendasController = new VendasController(db, vendasService);

  router.post(
    '/vendas',
    vendasController.registrarVenda.bind(vendasController),
  );

  return router;
}