import { Injectable } from '@angular/core';
import { Lead } from '../models/lead.model';
import { PersistedList } from './persisted-list';

const initialLeads: Lead[] = [
  { id: 'LEAD-2048', name: 'Neha Kapoor', company: 'PixelCraft Media', email: 'neha@pixelcraft.in', source: 'Website', assignedTo: 'Priya Patil', priority: 'High', status: 'Qualified' },
  { id: 'LEAD-2047', name: 'Siddharth Jain', company: 'Jain Auto Components', email: 'siddharth@jainauto.in', source: 'Referral', assignedTo: 'Rahul Sharma', priority: 'Medium', status: 'Contacted' },
  { id: 'LEAD-2046', name: 'Pooja Reddy', company: 'Sunrise Diagnostics', email: 'pooja@sunrisedx.in', source: 'LinkedIn', assignedTo: 'Amit Verma', priority: 'High', status: 'New' },
  { id: 'LEAD-2045', name: 'Dev Shah', company: 'Shah Textiles', email: 'dev@shahtextiles.in', source: 'Campaign', assignedTo: 'Sneha Kulkarni', priority: 'Low', status: 'New' },
  { id: 'LEAD-2044', name: 'Tanvi Bhosale', company: 'EduNest Academy', email: 'tanvi@edunest.in', source: 'Website', assignedTo: 'Rohan Deshmukh', priority: 'Medium', status: 'Qualified' },
  { id: 'LEAD-2043', name: 'Aditya Menon', company: 'Menon Exports', email: 'aditya@menonexports.in', source: 'Trade show', assignedTo: 'Priya Patil', priority: 'High', status: 'Contacted' },
  { id: 'LEAD-2042', name: 'Simran Kaur', company: 'Evergreen Foods', email: 'simran@evergreen.in', source: 'Referral', assignedTo: 'Amit Verma', priority: 'Low', status: 'Converted' },
  { id: 'LEAD-2041', name: 'Nikhil Gupta', company: 'Gupta & Sons', email: 'nikhil@guptasons.in', source: 'Website', assignedTo: 'Rahul Sharma', priority: 'Medium', status: 'New' },
  { id: 'LEAD-2040', name: 'Aarohi Shah', company: 'Aarohi Interiors', email: 'aarohi@interiors.in', source: 'LinkedIn', assignedTo: 'Sneha Kulkarni', priority: 'High', status: 'Qualified' },
  { id: 'LEAD-2039', name: 'Manav Sethi', company: 'Sethi Healthcare', email: 'manav@sethihealth.in', source: 'Campaign', assignedTo: 'Rohan Deshmukh', priority: 'Low', status: 'Lost' }
];

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly store = new PersistedList<Lead>('omnicrm-leads', initialLeads);
  readonly leads = this.store.items;
  add(lead: Lead): void { this.store.add(lead); }
  update(lead: Lead): void { this.store.update(lead); }
  delete(id: string): void { this.store.remove(id); }
}
