import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer, CustomerStatus } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class CustomersComponent {
  readonly service = inject(CustomerService);
  private readonly fb = inject(FormBuilder);
  search = '';
  statusFilter = 'All statuses';
  modalOpen = false;
  detailCustomer: Customer | null = null;
  editingId: string | null = null;
  readonly form = this.fb.group({
    name: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/)]],
    company: ['', Validators.required], location: ['', Validators.required], source: ['Website', Validators.required],
    status: ['Active' as CustomerStatus, Validators.required]
  });

  get filteredCustomers(): Customer[] {
    const query = this.search.trim().toLowerCase();
    return this.service.customers().filter(customer =>
      (this.statusFilter === 'All statuses' || customer.status === this.statusFilter) &&
      (!query || `${customer.id} ${customer.name} ${customer.email} ${customer.company} ${customer.location}`.toLowerCase().includes(query))
    );
  }
  get activeCount(): number { return this.service.customers().filter(customer => customer.status === 'Active').length; }
  get prospectCount(): number { return this.service.customers().filter(customer => customer.status === 'Prospect').length; }
  get inactiveCount(): number { return this.service.customers().filter(customer => customer.status === 'Inactive').length; }

  openAdd(): void { this.editingId = null; this.form.reset({ source: 'Website', status: 'Active' }); this.modalOpen = true; }
  openEdit(customer: Customer): void {
    this.editingId = customer.id;
    this.form.reset({ name: customer.name, email: customer.email, phone: customer.phone, company: customer.company, location: customer.location, source: customer.source, status: customer.status });
    this.modalOpen = true;
  }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const customer: Customer = { ...value, id: this.editingId ?? `CUS-${Date.now().toString().slice(-6)}` } as Customer;
    if (this.editingId) this.service.update(customer); else this.service.add(customer);
    this.modalOpen = false;
  }
  delete(customer: Customer): void {
    if (confirm(`Delete ${customer.name} from your customers?`)) this.service.delete(customer.id);
  }
  initials(name: string): string { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
}
