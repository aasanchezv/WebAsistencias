'use client'

import React, { createContext, useContext } from 'react';
import { Client } from '@/types/client';

const TenantContext = createContext<Client | null>(null);

export function TenantProvider({ tenant, children }: { tenant: Client; children: React.ReactNode }) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): Client {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant debe usarse dentro de TenantProvider');
  return ctx;
}