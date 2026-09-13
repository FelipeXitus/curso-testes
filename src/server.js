import criarApp from './app.js';
import { serverConfig } from './config/server.config.js';
import { EmailGateway } from './gateways/email.gateway.js';
import { EstoqueApiGateway } from './gateways/estoque-api.gateway.js';

const app = criarApp({
  emailGateway: new EmailGateway(),
  estoqueGateway: new EstoqueApiGateway(),
});

app.listen(serverConfig.port, () => {
  console.log(`Servidor rodando na porta ${serverConfig.port}`);
});