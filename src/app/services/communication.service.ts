import { Injectable } from '@angular/core';
import { Communication } from '../models/task.model';
import { PersistedList } from './persisted-list';

const initialCommunications: Communication[] = [
  { id: 'COM-001', customer: 'Rahul Sharma', channel: 'Email', date: '2026-11-03T10:30:00', summary: 'Shared the updated enterprise proposal and pricing sheet.', status: 'Completed' },
  { id: 'COM-002', customer: 'Priya Patil', channel: 'Phone Call', date: '2026-11-03T09:15:00', summary: 'Discussed rollout timeline with the operations team.', status: 'Completed' },
  { id: 'COM-003', customer: 'Amit Verma', channel: 'WhatsApp', date: '2026-11-02T16:45:00', summary: 'Confirmed availability for a product walkthrough.', status: 'Scheduled' },
  { id: 'COM-004', customer: 'Sneha Kulkarni', channel: 'Website Enquiries', date: '2026-11-02T14:10:00', summary: 'New enquiry about the education CRM package.', status: 'Open' },
  { id: 'COM-005', customer: 'Rohan Deshmukh', channel: 'Social Media', date: '2026-11-01T11:20:00', summary: 'Replied to a LinkedIn message requesting a demo.', status: 'Completed' },
  { id: 'COM-006', customer: 'Ananya Iyer', channel: 'Email', date: '2026-10-31T15:00:00', summary: 'Sent an introduction and healthcare case study.', status: 'Open' }
];

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private readonly store = new PersistedList<Communication>('omnicrm-communications', initialCommunications);
  readonly communications = this.store.items;
  add(item: Communication): void { this.store.add(item); }
}
