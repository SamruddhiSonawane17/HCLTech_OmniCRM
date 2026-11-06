import { Priority } from './lead.model';

export interface CrmTask {
  id: string;
  title: string;
  customer: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface Communication {
  id: string;
  customer: string;
  channel: 'Email' | 'Phone Call' | 'WhatsApp' | 'Website Enquiries' | 'Social Media';
  date: string;
  summary: string;
  status: 'Completed' | 'Scheduled' | 'Open';
}
