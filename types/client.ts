export interface Client {
  id:              number;
  name:            string;
  slug:            string;
  logo_url:        string;
  primary_color:   string;
  secondary_color: string | null;
  createdAt:       string;
  active:       boolean;
}