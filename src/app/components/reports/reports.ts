import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { CustomerService } from '../../services/customer.service';
import { LeadService } from '../../services/lead.service';
import { SalesService } from '../../services/sales.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('revenueChart') revenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('acquisitionChart') acquisitionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pipelineChart') pipelineCanvas!: ElementRef<HTMLCanvasElement>;
  readonly customers = inject(CustomerService);
  readonly leads = inject(LeadService);
  readonly sales = inject(SalesService);
  readonly sum = (total: number, amount: number): number => total + amount;
  period = 'This year';
  private charts: Chart[] = [];
  private get revenueSeries(): { labels: string[]; sales: number[] } {
    const now = new Date();
    const deals = this.sales.deals().filter(deal => deal.stage === 'Closed Won');
    if (this.period === 'Last 30 days') {
      const labels = ['Days 1–7', 'Days 8–14', 'Days 15–21', 'Days 22–30'];
      const sales = [0, 0, 0, 0];
      for (const deal of deals) {
        const [year, month, day] = deal.closeDate.split('-').map(Number);
        const closeDate = new Date(year, month - 1, day);
        const daysAgo = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - closeDate.getTime()) / 86_400_000);
        if (daysAgo >= 0 && daysAgo < 30) sales[Math.min(Math.floor(daysAgo / 7), 3)] += deal.value;
      }
      return { labels, sales };
    }

    const months = this.period === 'Last 6 months'
      ? Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1))
      : Array.from({ length: 12 }, (_, index) => new Date(now.getFullYear(), index, 1));
    const keys = months.map(month => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);
    return {
      labels: months.map(month => month.toLocaleString('en', { month: 'short' })),
      sales: keys.map(key => deals.filter(deal => deal.closeDate.startsWith(key)).reduce((total, deal) => total + deal.value, 0))
    };
  }
  get customerStatusData(): Array<{ label: string; count: number }> {
    return ['Active', 'Prospect', 'Inactive'].map(label => ({
      label,
      count: this.customers.customers().filter(customer => customer.status === label).length
    }));
  }
  get revenue(): number { return this.sales.deals().filter(deal => deal.stage === 'Closed Won').reduce((sum, deal) => sum + deal.value, 0); }
  get pipelineValue(): number { return this.sales.deals().filter(deal => !deal.stage.startsWith('Closed')).reduce((sum, deal) => sum + deal.value, 0); }
  get conversionRate(): number {
    const converted = this.leads.leads().filter(lead => lead.status === 'Converted').length;
    return this.leads.leads().length ? Math.round(converted / this.leads.leads().length * 100) : 0;
  }
  get employeePerformance() {
    const employees = ['Rahul Sharma', 'Priya Patil', 'Amit Verma', 'Sneha Kulkarni', 'Rohan Deshmukh'];
    return employees.map(name => ({
      name,
      deals: this.sales.deals().filter(deal => deal.owner === name).length,
      won: this.sales.deals().filter(deal => deal.owner === name && deal.stage === 'Closed Won').length,
      value: this.sales.deals().filter(deal => deal.owner === name && deal.stage === 'Closed Won').reduce((sum, deal) => sum + deal.value, 0)
    })).sort((a, b) => b.value - a.value);
  }
  initials(name: string): string { return name.split(' ').map(part => part[0]).join('').toUpperCase(); }

  ngAfterViewInit(): void {
    const grid = '#eeede7'; const ticks = { color: '#7d867d', font: { size: 10 } };
    const data = this.revenueSeries;
    this.charts = [
      new Chart(this.revenueCanvas.nativeElement, { type: 'bar', data: { labels: data.labels, datasets: [{ label: 'Closed won value', data: data.sales, backgroundColor: '#58765c', borderRadius: 4, maxBarThickness: 26 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: item => `₹${Number(item.raw).toLocaleString('en-IN')}` } } }, scales: { x: { grid: { display: false }, ticks }, y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { ...ticks, callback: value => `₹${Number(value).toLocaleString('en-IN')}` } } } } }),
      new Chart(this.acquisitionCanvas.nativeElement, { type: 'bar', data: { labels: this.customerStatusData.map(item => item.label), datasets: [{ label: 'Customers', data: this.customerStatusData.map(item => item.count), backgroundColor: ['#58765c', '#c69a5a', '#d9d9cf'], borderRadius: 4, maxBarThickness: 30 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks }, y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { ...ticks, precision: 0 } } } } }),
      new Chart(this.pipelineCanvas.nativeElement, { type: 'bar', data: { labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'], datasets: [{ label: 'Deals', data: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => this.sales.deals().filter(deal => deal.stage === stage).length), backgroundColor: ['#d9dfd4','#b9c9b8','#94ab94','#789379','#5e7d63','#41664e','#d9d9cf'], borderRadius: 4, maxBarThickness: 27 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks }, y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { ...ticks, precision: 0 } } } } })
    ];
  }

  updatePeriod(): void {
    if (!this.charts.length) return;
    const data = this.revenueSeries;
    this.charts[0].data.labels = data.labels; this.charts[0].data.datasets[0].data = data.sales;
    this.charts.forEach(chart => chart.update());
  }

  exportCsv(): void {
    const rows = [
      ['OmniCRM analytics export', `Period: ${this.period}`],
      ['Metric', 'Value'],
      ['Total customers', String(this.customers.customers().length)],
      ['Total leads', String(this.leads.leads().length)],
      ['Lead conversion rate', `${this.conversionRate}%`],
      ['Closed won revenue (INR)', String(this.revenue)],
      [],
      ['Employee', 'Deals', 'Deals won', 'Won value (INR)'],
      ...this.employeePerformance.map(person => [person.name, String(person.deals), String(person.won), String(person.value)])
    ];
    const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `omnicrm-report-${this.period.toLowerCase().replaceAll(' ', '-')}.csv`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  ngOnDestroy(): void { this.charts.forEach(chart => chart.destroy()); }
}
