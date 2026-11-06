import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { LeadService } from '../../services/lead.service';
import { SalesService } from '../../services/sales.service';
import { TaskService } from '../../services/task.service';
import { CommunicationService } from '../../services/communication.service';
import { AuthService } from '../../services/auth.service';
import { getGreeting } from '../../utils/greeting';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('growthChart') growthCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salesChart') salesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('conversionChart') conversionCanvas!: ElementRef<HTMLCanvasElement>;
  readonly customers = inject(CustomerService);
  readonly leads = inject(LeadService);
  readonly sales = inject(SalesService);
  readonly tasks = inject(TaskService);
  readonly communication = inject(CommunicationService);
  readonly auth = inject(AuthService);
  private charts: Chart[] = [];
  greeting = getGreeting(new Date());
  private readonly greetingTimer = window.setInterval(() => {
    this.greeting = getGreeting(new Date());
  }, 60_000);

  get customerMetric(): number { return this.customers.customers().length; }
  get activeCustomerCount(): number { return this.customers.customers().filter(customer => customer.status === 'Active').length; }
  get leadMetric(): number { return this.leads.leads().length; }
  get newLeadCount(): number { return this.leads.leads().filter(lead => lead.status === 'New').length; }
  get activeDeals(): number { return this.sales.deals().filter(deal => !deal.stage.startsWith('Closed')).length; }
  get openPipelineValue(): number { return this.sales.deals().filter(deal => !deal.stage.startsWith('Closed')).reduce((total, deal) => total + deal.value, 0); }
  get followUps() { return this.tasks.tasks().filter(task => !task.completed).slice(0, 4); }
  get recentActivity() { return [...this.communication.communications()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5); }
  get wonDeals(): number { return this.sales.deals().filter(deal => deal.stage === 'Closed Won').length; }
  get wonRevenue(): number { return this.sales.deals().filter(deal => deal.stage === 'Closed Won').reduce((total, deal) => total + deal.value, 0); }
  get leadStatusSummary(): Array<{ label: string; count: number; color: string }> {
    const statuses = [
      { label: 'New', color: 'dot-blue' },
      { label: 'Contacted', color: 'dot-green' },
      { label: 'Qualified', color: 'dot-amber' },
      { label: 'Converted', color: 'dot-violet' },
      { label: 'Lost', color: 'dot-gray' }
    ];
    return statuses.map(status => ({
      ...status,
      count: this.leads.leads().filter(lead => lead.status === status.label).length
    }));
  }
  initials(name: string): string { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
  channelIcon(channel: string): string {
    return { Email: 'bi-envelope', 'Phone Call': 'bi-telephone', WhatsApp: 'bi-whatsapp', 'Website Enquiries': 'bi-globe2', 'Social Media': 'bi-chat-square-dots' }[channel] ?? 'bi-chat-dots';
  }
  printReport(): void { window.print(); }

  ngAfterViewInit(): void {
    const grid = '#eeede7';
    const ticks = { color: '#7d867d', font: { size: 10 } };
    this.charts = [
      new Chart(this.growthCanvas.nativeElement, {
        type: 'bar',
        data: { labels: this.leadStatusSummary.map(item => item.label), datasets: [{ label: 'Leads', data: this.leadStatusSummary.map(item => item.count), backgroundColor: ['#58765c', '#87a083', '#c69a5a', '#8e7c9c', '#d9d9cf'], borderRadius: 4, maxBarThickness: 26 }] },
        options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { ...ticks, precision: 0 } }, y: { grid: { display: false }, border: { display: false }, ticks } } }
      }),
      new Chart(this.salesCanvas.nativeElement, {
        type: 'bar',
        data: { labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'], datasets: [{ label: 'Deal value', data: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => this.sales.deals().filter(deal => deal.stage === stage).reduce((total, deal) => total + deal.value, 0)), backgroundColor: ['#d9dfd4', '#b9c9b8', '#94ab94', '#789379', '#5e7d63', '#41664e', '#d9d9cf'], borderRadius: 4, maxBarThickness: 26 }] },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: item => `₹${Number(item.raw).toLocaleString('en-IN')}` } } }, scales: { x: { grid: { display: false }, ticks }, y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { ...ticks, callback: value => `₹${Number(value).toLocaleString('en-IN')}` } } } }
      }),
      new Chart(this.conversionCanvas.nativeElement, {
        type: 'doughnut',
        data: { labels: this.leadStatusSummary.map(item => item.label), datasets: [{ data: this.leadStatusSummary.map(item => item.count), backgroundColor: ['#58765c', '#87a083', '#c69a5a', '#8e7c9c', '#d9d9cf'], borderWidth: 0, hoverOffset: 4 }] },
        options: { maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: item => `${item.label}: ${item.raw}` } } } }
      })
    ];
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
    window.clearInterval(this.greetingTimer);
  }
}
