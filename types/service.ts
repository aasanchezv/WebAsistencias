export interface Service {
  id: number;
  name: string | null;
  icon: string;
  text: string;
  description: string;
  createdAt: string;
  active: boolean;
}