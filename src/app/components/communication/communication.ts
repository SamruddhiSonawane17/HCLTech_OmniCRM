import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Communication } from '../../models/task.model';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './communication.html',
  styleUrl: './communication.css'
})
export class CommunicationComponent {
  readonly service = inject(CommunicationService);
  private readonly fb = inject(FormBuilder);
  readonly channels: Communication['channel'][] = ['Email', 'Phone Call', 'WhatsApp', 'Website Enquiries', 'Social Media'];
  search = '';
  channelFilter = 'All channels';
  modalOpen = false;
  noticeVisible = true;
  readonly form = this.fb.group({
    customer: ['', Validators.required], channel: ['Email' as Communication['channel'], Validators.required],
    date: [new Date().toISOString().slice(0, 16), Validators.required], summary: ['', Validators.required],
    status: ['Open' as Communication['status'], Validators.required]
  });
  get filtered(): Communication[] {
    const query = this.search.trim().toLowerCase();
    return [...this.service.communications()].filter(item =>
      (this.channelFilter === 'All channels' || item.channel === this.channelFilter) &&
      (!query || `${item.customer} ${item.summary} ${item.channel}`.toLowerCase().includes(query))
    ).sort((a, b) => b.date.localeCompare(a.date));
  }
  get channelCount(): number { return new Set(this.service.communications().map(item => item.channel)).size; }
  icon(channel: Communication['channel']): string {
    return { Email: 'bi-envelope', 'Phone Call': 'bi-telephone', WhatsApp: 'bi-whatsapp', 'Website Enquiries': 'bi-globe2', 'Social Media': 'bi-chat-square-dots' }[channel];
  }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.service.add({ ...this.form.getRawValue(), id: `COM-${Date.now().toString().slice(-6)}` } as Communication);
    this.modalOpen = false;
  }
}
