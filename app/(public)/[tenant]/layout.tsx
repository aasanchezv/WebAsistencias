import { getTenant } from '@/lib/tenant/getTenant';
import { TenantProvider } from '@/components/providers/TenantProvider';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenant(slug);

  return (
    <TenantProvider tenant={tenant}>
      {children}
    </TenantProvider>
  );
}