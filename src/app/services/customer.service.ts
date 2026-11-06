import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { PersistedList } from './persisted-list';

const initialCustomers: Customer[] = [
  { id: 'CUS-1024', name: 'Rahul Sharma', email: 'rahul.sharma@northstar.in', phone: '+91 98765 43210', company: 'Northstar Technologies', location: 'Mumbai, Maharashtra', source: 'Website', status: 'Active' },
  { id: 'CUS-1023', name: 'Priya Patil', email: 'priya.patil@greenleaf.co.in', phone: '+91 98220 11223', company: 'Greenleaf Organics', location: 'Pune, Maharashtra', source: 'Referral', status: 'Active' },
  { id: 'CUS-1022', name: 'Amit Verma', email: 'amit.verma@apexlogistics.in', phone: '+91 98100 56789', company: 'Apex Logistics', location: 'New Delhi', source: 'LinkedIn', status: 'Prospect' },
  { id: 'CUS-1021', name: 'Sneha Kulkarni', email: 'sneha.k@brightpath.edu.in', phone: '+91 98230 44556', company: 'BrightPath Learning', location: 'Bengaluru, Karnataka', source: 'Campaign', status: 'Active' },
  { id: 'CUS-1020', name: 'Rohan Deshmukh', email: 'rohan.d@urbanliving.in', phone: '+91 97654 33221', company: 'Urban Living Studio', location: 'Pune, Maharashtra', source: 'Website', status: 'Active' },
  { id: 'CUS-1019', name: 'Ananya Iyer', email: 'ananya@silveroakhealth.in', phone: '+91 98450 77889', company: 'Silver Oak Health', location: 'Chennai, Tamil Nadu', source: 'Referral', status: 'Prospect' },
  { id: 'CUS-1018', name: 'Vikram Mehta', email: 'vikram@mehtafinance.in', phone: '+91 98980 12345', company: 'Mehta Financials', location: 'Ahmedabad, Gujarat', source: 'Trade show', status: 'Active' },
  { id: 'CUS-1017', name: 'Kavya Nair', email: 'kavya@coastlinehotels.in', phone: '+91 94470 45678', company: 'Coastline Hospitality', location: 'Kochi, Kerala', source: 'LinkedIn', status: 'Inactive' },
  { id: 'CUS-1016', name: 'Arjun Rao', email: 'arjun.rao@orbitworks.in', phone: '+91 98490 87654', company: 'OrbitWorks', location: 'Hyderabad, Telangana', source: 'Website', status: 'Active' },
  { id: 'CUS-1015', name: 'Meera Joshi', email: 'meera@petalretail.in', phone: '+91 98222 33445', company: 'Petal Retail Group', location: 'Nagpur, Maharashtra', source: 'Campaign', status: 'Active' },
  { id: 'CUS-1014', name: 'Karan Malhotra', email: 'karan@bluepeak.in', phone: '+91 98111 22233', company: 'BluePeak Consulting', location: 'Gurugram, Haryana', source: 'Referral', status: 'Prospect' },
  { id: 'CUS-1013', name: 'Isha Chatterjee', email: 'isha@craftandco.in', phone: '+91 98300 99887', company: 'Craft & Co.', location: 'Kolkata, West Bengal', source: 'Website', status: 'Active' }
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly store = new PersistedList<Customer>('omnicrm-customers', initialCustomers);
  readonly customers = this.store.items;
  add(customer: Customer): void { this.store.add(customer); }
  update(customer: Customer): void { this.store.update(customer); }
  delete(id: string): void { this.store.remove(id); }
}
