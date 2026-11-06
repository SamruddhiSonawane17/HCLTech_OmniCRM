import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./components/login/login').then(m => m.LoginComponent), title: 'Sign in · OmniCRM' },
  { path: 'signup', canActivate: [guestGuard], loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent), title: 'Create account · OmniCRM' },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Dashboard · OmniCRM' },
  { path: 'customers', canActivate: [authGuard], loadComponent: () => import('./components/customers/customers').then(m => m.CustomersComponent), title: 'Customers · OmniCRM' },
  { path: 'leads', canActivate: [authGuard], loadComponent: () => import('./components/leads/leads').then(m => m.LeadsComponent), title: 'Leads · OmniCRM' },
  { path: 'sales-pipeline', canActivate: [authGuard], loadComponent: () => import('./components/sales-pipeline/sales-pipeline').then(m => m.SalesPipelineComponent), title: 'Sales Pipeline · OmniCRM' },
  { path: 'communication', canActivate: [authGuard], loadComponent: () => import('./components/communication/communication').then(m => m.CommunicationComponent), title: 'Communication · OmniCRM' },
  { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./components/tasks/tasks').then(m => m.TasksComponent), title: 'Tasks & Follow-ups · OmniCRM' },
  { path: 'reports', canActivate: [authGuard], loadComponent: () => import('./components/reports/reports').then(m => m.ReportsComponent), title: 'Reports · OmniCRM' },
  { path: 'settings', canActivate: [authGuard], loadComponent: () => import('./components/settings/settings').then(m => m.SettingsComponent), title: 'Settings · OmniCRM' },
  { path: '**', redirectTo: 'dashboard' }
];
