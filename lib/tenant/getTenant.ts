// /lib/tenant/getTenant.ts

import { prisma } from '@/lib/db';
import { cache } from 'react';

export const getTenant = cache(async (slug: string) => {
  if (!slug) throw new Error('Slug requerido');

  const tenant = await prisma.client.findUnique({
    where: {
      slug: slug.toLowerCase().trim(),
    },
  });

  if (!tenant) {
    throw new Error('Tenant no encontrado');
  }

  return tenant;
});