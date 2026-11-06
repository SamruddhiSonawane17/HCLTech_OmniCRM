import { Injectable } from '@angular/core';
import { CrmTask } from '../models/task.model';
import { PersistedList } from './persisted-list';

const initialTasks: CrmTask[] = [
  { id: 'TASK-01', title: 'Send revised proposal', customer: 'Greenleaf Organics', assignedTo: 'Priya Patil', dueDate: '2026-11-04', priority: 'High', completed: false },
  { id: 'TASK-02', title: 'Product walkthrough call', customer: 'Apex Logistics', assignedTo: 'Amit Verma', dueDate: '2026-11-05', priority: 'Medium', completed: false },
  { id: 'TASK-03', title: 'Share onboarding checklist', customer: 'BrightPath Learning', assignedTo: 'Sneha Kulkarni', dueDate: '2026-11-03', priority: 'Low', completed: true },
  { id: 'TASK-04', title: 'Confirm contract terms', customer: 'Northstar Technologies', assignedTo: 'Rahul Sharma', dueDate: '2026-11-06', priority: 'High', completed: false },
  { id: 'TASK-05', title: 'Follow up on requirements', customer: 'Silver Oak Health', assignedTo: 'Priya Patil', dueDate: '2026-11-09', priority: 'Medium', completed: false },
  { id: 'TASK-06', title: 'Book discovery meeting', customer: 'Urban Living Studio', assignedTo: 'Rohan Deshmukh', dueDate: '2026-11-02', priority: 'High', completed: false }
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly store = new PersistedList<CrmTask>('omnicrm-tasks', initialTasks);
  readonly tasks = this.store.items;
  add(task: CrmTask): void { this.store.add(task); }
  update(task: CrmTask): void { this.store.update(task); }
  delete(id: string): void { this.store.remove(id); }
}
