import { Component, EventEmitter, Output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { LeadService } from '../../services/lead.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  @Output() menuClick = new EventEmitter<void>();
  private readonly router = inject(Router);
  private readonly customers = inject(CustomerService);
  private readonly leads = inject(LeadService);
  readonly auth = inject(AuthService);
  title = 'Dashboard';
  readonly today = new Date();
  search = '';
  showSearch = false;
  showNotifications = false;
  showProfile = false;

  constructor() {
    this.setTitle(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => this.setTitle((event as NavigationEnd).urlAfterRedirects));
  }

  get results(): Array<{ name: string; detail: string; route: string }> {
    const query = this.search.trim().toLowerCase();
    if (!query) return [];
    return [
      ...this.customers.customers().filter(item => `${item.name} ${item.company}`.toLowerCase().includes(query)).slice(0, 4)
        .map(item => ({ name: item.name, detail: item.company, route: '/customers' })),
      ...this.leads.leads().filter(item => `${item.name} ${item.company}`.toLowerCase().includes(query)).slice(0, 4)
        .map(item => ({ name: item.name, detail: `${item.company} · Lead`, route: '/leads' }))
    ].slice(0, 6);
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
    this.search = '';
    this.showSearch = false;
  }

  signOut(): void {
    this.auth.signOut();
    this.showProfile = false;
    void this.router.navigateByUrl('/login');
  }

  get userInitials(): string {
    return this.auth.currentUser.name.split(/\s+/).map(part => part[0] ?? '').join('').slice(0, 2).toUpperCase();
  }

  private setTitle(url: string): void {
    const segment = url.split('/')[1] || 'dashboard';
    const titles: Record<string, string> = {
      dashboard: 'Dashboard', customers: 'Customers', leads: 'Leads',
      'sales-pipeline': 'Sales Pipeline', communication: 'Communication',
      tasks: 'Tasks & Follow-ups', reports: 'Reports & Analytics', settings: 'Settings'
    };
    this.title = titles[segment] ?? 'Dashboard';
  }
}
