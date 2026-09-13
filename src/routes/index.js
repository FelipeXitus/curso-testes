import autoresRoutes from './autores.routes.js';
import editorasRoutes from './editoras.routes.js';
import livrosRoutes from './livros.routes.js';
import vendasRoutes from './vendas.routes.js';

export function routes(app, dependencias) {
  app.route('/').get((_req, res) => {
    res.send({ titulo: 'Curso de Testes' });
  });

  app.use(autoresRoutes);
  app.use(editorasRoutes);
  app.use(livrosRoutes);
  app.use(vendasRoutes(dependencias));
}
