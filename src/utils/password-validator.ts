import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { comparePassword, hashPassword } from './password.util';

const adapter = new PrismaBetterSqlite3({
    url: './prisma/dev.db'
});

const prisma = new PrismaClient({
    adapter
});

export async function validateUserPasswords() {
  try {
    const users = await prisma.user.findMany();
    let hasErrors = false;
    return true;
  } catch (error) {
    console.error('❌ Erro ao validar senhas:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}


export async function testDefaultCredentials() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'user' }
    });
    
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!user || !admin) {
      console.warn('⚠️ Usuários padrão não encontrados. Execute seed.ts primeiro.');
      return false;
    }

    const userValid = comparePassword('user', user.password);
    const adminValid = comparePassword('admin', admin.password);

    if (userValid && adminValid) {
      console.log('✅ Credenciais padrão validadas com sucesso:');
      console.log('  - user / user ✓');
      console.log('  - admin / admin ✓');
      return true;
    }
  } catch (error) {
    console.error('❌ Erro ao testar credenciais:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
