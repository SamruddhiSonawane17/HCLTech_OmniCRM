import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Deal, DealStage } from '../../models/sales.model';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-pipeline',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './sales-pipeline.html',
  styleUrl: './sales-pipeline.css'
})
export class SalesPipelineComponent {
  readonly service = inject(SalesService);
  private readonly fb = inject(FormBuilder);
  readonly stages: DealStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  readonly employees = ['Rahul Sharma', 'Priya Patil', 'Amit Verma', 'Sneha Kulkarni', 'Rohan Deshmukh'];
  modalOpen = false;
  editingId: string | null = null;
  readonly form = this.fb.group({
    customer: ['', Validators.required], title: ['', Validators.required],
    value: [null as number | null, [Validators.required, Validators.min(1)]],
    owner: ['Rahul Sharma', Validators.required], closeDate: ['', Validators.required],
    stage: ['New' as DealStage, Validators.required]
  });
  get openValue(): number { return this.service.deals().filter(deal => !deal.stage.startsWith('Closed')).reduce((sum, deal) => sum + deal.value, 0); }
  get wonValue(): number { return this.service.deals().filter(deal => deal.stage === 'Closed Won').reduce((sum, deal) => sum + deal.value, 0); }
  get activeDealCount(): number { return this.service.deals().filter(deal => !deal.stage.startsWith('Closed')).length; }
  get conversion(): number {
    const closed = this.service.deals().filter(deal => deal.stage.startsWith('Closed'));
    return closed.length ? Math.round(closed.filter(deal => deal.stage === 'Closed Won').length / closed.length * 100) : 0;
  }
  dealsIn(stage: DealStage): Deal[] { return this.service.deals().filter(deal => deal.stage === stage); }
  stageValue(stage: DealStage): number { return this.dealsIn(stage).reduce((sum, deal) => sum + deal.value, 0); }
  updateStage(deal: Deal, stage: string): void { this.service.update({ ...deal, stage: stage as DealStage }); }
  openAdd(): void { this.editingId = null; this.form.reset({ customer: '', title: '', value: null, owner: 'Rahul Sharma', closeDate: '', stage: 'New' }); this.modalOpen = true; }
  openEdit(deal: Deal): void { this.editingId = deal.id; this.form.reset({ customer: deal.customer, title: deal.title, value: deal.value, owner: deal.owner, closeDate: deal.closeDate, stage: deal.stage }); this.modalOpen = true; }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const deal: Deal = { ...this.form.getRawValue(), id: this.editingId ?? `DEAL-${Date.now().toString().slice(-5)}`, value: Number(this.form.controls.value.value) } as Deal;
    if (this.editingId) this.service.update(deal); else this.service.add(deal);
    this.modalOpen = false;
  }
  delete(deal: Deal): void { if (confirm(`Delete "${deal.title}"?`)) this.service.delete(deal.id); }
  shortName(name: string): string { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
}
