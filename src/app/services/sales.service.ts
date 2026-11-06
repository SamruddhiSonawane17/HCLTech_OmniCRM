import { Injectable } from '@angular/core';
import { Deal } from '../models/sales.model';
import { PersistedList } from './persisted-list';

const initialDeals: Deal[] = [
  { id: 'DEAL-301', customer: 'Northstar Technologies', title: 'Enterprise CRM rollout', value: 325000, owner: 'Rahul Sharma', closeDate: '2026-11-18', stage: 'Negotiation' },
  { id: 'DEAL-302', customer: 'Greenleaf Organics', title: 'Customer engagement suite', value: 185000, owner: 'Priya Patil', closeDate: '2026-11-24', stage: 'Proposal' },
  { id: 'DEAL-303', customer: 'Apex Logistics', title: 'Sales automation plan', value: 260000, owner: 'Amit Verma', closeDate: '2026-12-02', stage: 'Qualified' },
  { id: 'DEAL-304', customer: 'BrightPath Learning', title: 'Admissions & CRM package', value: 145000, owner: 'Sneha Kulkarni', closeDate: '2026-10-15', stage: 'Closed Won' },
  { id: 'DEAL-305', customer: 'Urban Living Studio', title: 'Omnichannel growth plan', value: 210000, owner: 'Rohan Deshmukh', closeDate: '2026-12-12', stage: 'Contacted' },
  { id: 'DEAL-306', customer: 'Silver Oak Health', title: 'Patient experience platform', value: 390000, owner: 'Priya Patil', closeDate: '2026-12-20', stage: 'New' },
  { id: 'DEAL-307', customer: 'Mehta Financials', title: 'Financial services CRM', value: 275000, owner: 'Amit Verma', closeDate: '2026-11-29', stage: 'Negotiation' },
  { id: 'DEAL-308', customer: 'OrbitWorks', title: 'Team collaboration suite', value: 120000, owner: 'Rahul Sharma', closeDate: '2026-10-12', stage: 'Closed Won' },
  { id: 'DEAL-309', customer: 'Petal Retail Group', title: 'Retail CRM expansion', value: 98000, owner: 'Sneha Kulkarni', closeDate: '2026-12-08', stage: 'Proposal' },
  { id: 'DEAL-310', customer: 'BluePeak Consulting', title: 'Consulting sales workspace', value: 160000, owner: 'Rohan Deshmukh', closeDate: '2026-12-16', stage: 'New' }
];

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly store = new PersistedList<Deal>('omnicrm-deals', initialDeals);
  readonly deals = this.store.items;
  add(deal: Deal): void { this.store.add(deal); }
  update(deal: Deal): void { this.store.update(deal); }
  delete(id: string): void { this.store.remove(id); }
}
