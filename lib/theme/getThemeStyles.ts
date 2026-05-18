export function getThemeStyles(tenant: {
  primary_color: string;
  secondary_color?: string;
}): React.CSSProperties {
  return {
    ['--primary' as any]: tenant.primary_color,
    ['--secondary' as any]: tenant.secondary_color || '#000',
  };
}