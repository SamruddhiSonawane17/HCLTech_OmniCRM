export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  assignedTo: string;
  priority: Priority;
  status: LeadStatus;
}
