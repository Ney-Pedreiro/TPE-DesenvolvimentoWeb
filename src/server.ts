import { app } from "./app";
import { validateUserPasswords } from "./utils/password-validator";

const PORT = 3000;

// Validar senhas dos usuários ao iniciar
validateUserPasswords().then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(error => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});