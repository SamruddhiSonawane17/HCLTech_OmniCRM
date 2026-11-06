import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lead, LeadStatus, Priority } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leads.html',
  styleUrl: './leads.css'
})
export class LeadsComponent {
  readonly service = inject(LeadService);
  private readonly fb = inject(FormBuilder);
  readonly statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
  readonly employees = ['Rahul Sharma', 'Priya Patil', 'Amit Verma', 'Sneha Kulkarni', 'Rohan Deshmukh'];
  search = '';
  priorityFilter = 'All priorities';
  statusFilter = 'All statuses';
  modalOpen = false;
  editingId: string | null = null;
  readonly form = this.fb.group({
    name: ['', Validators.required], company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]], source: ['Website', Validators.required],
    assignedTo: ['Rahul Sharma', Validators.required], priority: ['Medium' as Priority, Validators.required],
    status: ['New' as LeadStatus, Validators.required]
  });

  get filteredLeads(): Lead[] {
    const query = this.search.trim().toLowerCase();
    return this.service.leads().filter(lead =>
      (this.priorityFilter === 'All priorities' || lead.priority === this.priorityFilter) &&
      (this.statusFilter === 'All statuses' || lead.status === this.statusFilter) &&
      (!query || `${lead.name} ${lead.company} ${lead.email} ${lead.assignedTo}`.toLowerCase().includes(query))
    );
  }
  get countNew(): number { return this.service.leads().filter(lead => lead.status === 'New').length; }
  get countQualified(): number { return this.service.leads().filter(lead => lead.status === 'Qualified').length; }
  get countConverted(): number { return this.service.leads().filter(lead => lead.status === 'Converted').length; }

  openAdd(): void { this.editingId = null; this.form.reset({ source: 'Website', assignedTo: 'Rahul Sharma', priority: 'Medium', status: 'New' }); this.modalOpen = true; }
  openEdit(lead: Lead): void { this.editingId = lead.id; this.form.reset({ name: lead.name, company: lead.company, email: lead.email, source: lead.source, assignedTo: lead.assignedTo, priority: lead.priority, status: lead.status }); this.modalOpen = true; }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const lead: Lead = { ...value, id: this.editingId ?? `LEAD-${Date.now().toString().slice(-6)}` } as Lead;
    if (this.editingId) this.service.update(lead); else this.service.add(lead);
    this.modalOpen = false;
  }
  delete(lead: Lead): void { if (confirm(`Delete the lead for ${lead.name}?`)) this.service.delete(lead.id); }
  updateStatus(lead: Lead, status: string): void { this.service.update({ ...lead, status: status as LeadStatus }); }
  initials(name: string): string { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
}
