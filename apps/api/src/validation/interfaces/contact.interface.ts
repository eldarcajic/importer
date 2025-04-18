export interface Contact {
  organization_name: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  [key: `contact_attribute_${string}`]: string;
  error?: string;
}
