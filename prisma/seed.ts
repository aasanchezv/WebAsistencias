// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: [
      {
        name: 'Prueba',
        slug: 'prueba',
        logo_url: '/logos/prueba.png',
        primary_color: '#2563eb'
      },
      {
        name: 'Cliente B',
        slug: 'clienteb',
        logo_url: '/logos/clienteB.png',
        primary_color: '#dc2626'
      }
    ]
  });
}

main();