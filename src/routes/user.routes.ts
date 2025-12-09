import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateSession, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Todas as rotas de usuários requerem autenticação e permissão de admin
router.use(authenticateSession);
router.use(requireAdmin);

// GET - Listar todos os usuários
router.get('/', userController.getAllUsers.bind(userController));

// GET - Buscar usuário por ID
router.get('/:id', userController.getUserById.bind(userController));

// POST - Criar novo usuário
router.post('/', userController.createUser.bind(userController));

// PUT - Atualizar usuário
router.put('/:id', userController.updateUser.bind(userController));

// DELETE - Deletar usuário
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;
