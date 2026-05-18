export interface User {
  id:        number;
  email:     string;
  password:  string;
  name:      string | null;
  clientId:  number;
  createdAt: string;
  client?: {
    id:   number;
    name: string | null;
  };
  active: boolean;
}