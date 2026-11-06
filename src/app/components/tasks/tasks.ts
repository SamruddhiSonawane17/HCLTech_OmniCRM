import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrmTask } from '../../models/task.model';
import { Priority } from '../../models/lead.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent {
  readonly service = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  readonly employees = ['Rahul Sharma', 'Priya Patil', 'Amit Verma', 'Sneha Kulkarni', 'Rohan Deshmukh'];
  search = '';
  filter = 'All tasks';
  modalOpen = false;
  editingId: string | null = null;
  readonly form = this.fb.group({
    title: ['', Validators.required], customer: ['', Validators.required],
    assignedTo: ['Rahul Sharma', Validators.required], dueDate: ['', Validators.required],
    priority: ['Medium' as Priority, Validators.required]
  });
  private readonly today = new Date().toISOString().slice(0, 10);
  get pending(): number { return this.service.tasks().filter(task => !task.completed).length; }
  get completed(): number { return this.service.tasks().filter(task => task.completed).length; }
  get overdue(): number { return this.service.tasks().filter(task => !task.completed && task.dueDate < this.today).length; }
  get upcoming(): number { return this.service.tasks().filter(task => !task.completed && task.dueDate >= this.today && task.dueDate <= this.addDays(this.today, 7)).length; }
  get filteredTasks(): CrmTask[] {
    const query = this.search.trim().toLowerCase();
    return [...this.service.tasks()].filter(task =>
      (this.filter === 'All tasks' || (this.filter === 'Pending' && !task.completed) || (this.filter === 'Completed' && task.completed) || (this.filter === 'Overdue' && !task.completed && task.dueDate < this.today)) &&
      (!query || `${task.title} ${task.customer} ${task.assignedTo}`.toLowerCase().includes(query))
    ).sort((a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate));
  }
  openAdd(): void { this.editingId = null; this.form.reset({ title: '', customer: '', assignedTo: 'Rahul Sharma', dueDate: this.today, priority: 'Medium' }); this.modalOpen = true; }
  openEdit(task: CrmTask): void { this.editingId = task.id; this.form.reset({ title: task.title, customer: task.customer, assignedTo: task.assignedTo, dueDate: task.dueDate, priority: task.priority }); this.modalOpen = true; }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const task = { ...this.form.getRawValue(), id: this.editingId ?? `TASK-${Date.now().toString().slice(-6)}`, completed: this.editingId ? this.service.tasks().find(item => item.id === this.editingId)?.completed ?? false : false } as CrmTask;
    if (this.editingId) this.service.update(task); else this.service.add(task);
    this.modalOpen = false;
  }
  toggle(task: CrmTask): void { this.service.update({ ...task, completed: !task.completed }); }
  delete(task: CrmTask): void { if (confirm(`Delete "${task.title}"?`)) this.service.delete(task.id); }
  isOverdue(task: CrmTask): boolean { return !task.completed && task.dueDate < this.today; }
  initials(name: string): string { return name.split(' ').map(word => word[0]).join('').toUpperCase(); }
  private addDays(date: string, days: number): string { const value = new Date(`${date}T00:00:00`); value.setDate(value.getDate() + days); return value.toISOString().slice(0, 10); }
}
