import 'dotenv/config'; // 👈 ESTO ES CLAVE

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.admin.create({
    data: {
      email: 'admin@test.com',
      password,
      name: 'Admin',
    },
  });

  console.log('Admin creado');
}

main();