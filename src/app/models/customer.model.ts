export type CustomerStatus = 'Active' | 'Prospect' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  source: string;
  status: CustomerStatus;
}
