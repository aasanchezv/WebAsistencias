export type Tenant = {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  primary_color: string;
  secondary_color?: string;
  createdAt: Date
};