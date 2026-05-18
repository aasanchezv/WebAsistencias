export interface Subservice {
  id:          number;
  name:        string | null;
  icon:        string;
  text:        string;
  description: string;
  serviceId:   number;
  createdAt:   string;
  phone:       string | null;
  whatsapp:    string | null;
  service?: {
    id:   number;
    name: string | null;
  };
}