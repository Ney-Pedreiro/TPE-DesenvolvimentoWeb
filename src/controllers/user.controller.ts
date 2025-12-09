import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
      }

      // Verificar se usuário já existe
      const existingUser = await userService.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: 'Usuário já existe' });
      }

      const user = await userService.createUser({
        username,
        password,
        role: role || 'USER'
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      
      if (!username || !role) {
        return res.status(400).json({ error: 'Username e role são obrigatórios' });
      }

      const user = await userService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      if (username !== user.username) {
        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
          return res.status(409).json({ error: 'Username já está em uso' });
        }
      }

      const updateData: any = {
        username,
        role
      };

      if (password) {
        updateData.password = password;
      }

      const updatedUser = await userService.updateUser(parseInt(id), updateData);

      res.json({
        message: 'Usuário atualizado com sucesso',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (req.session.user?.id === parseInt(id)) {
        return res.status(403).json({ error: 'Você não pode deletar sua própria conta' });
      }

      const deletedUser = await userService.deleteUser(parseInt(id));

      res.json({
        message: 'Usuário deletado com sucesso',
        user: deletedUser
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}
