import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  readonly auth = inject(AuthService);
  private readonly tasks = inject(TaskService);
  @Input() mobileOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  readonly links = [
    { label: 'Dashboard', path: '/dashboard', icon: 'bi-grid-1x2-fill' },
    { label: 'Customers', path: '/customers', icon: 'bi-people' },
    { label: 'Leads', path: '/leads', icon: 'bi-person-lines-fill' },
    { label: 'Sales Pipeline', path: '/sales-pipeline', icon: 'bi-kanban' },
    { label: 'Communication', path: '/communication', icon: 'bi-chat-dots' },
    { label: 'Tasks & Follow-ups', path: '/tasks', icon: 'bi-check2-square' },
    { label: 'Reports', path: '/reports', icon: 'bi-bar-chart-line' },
    { label: 'Settings', path: '/settings', icon: 'bi-gear' }
  ];

  get pendingTaskCount(): number {
    return this.tasks.tasks().filter(task => !task.completed).length;
  }

  get userInitials(): string {
    return this.auth.currentUser.name.split(/\s+/).map(part => part[0] ?? '').join('').slice(0, 2).toUpperCase();
  }
}
