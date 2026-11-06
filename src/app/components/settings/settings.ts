import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  activeTab = 'Profile';
  savedMessage = '';
  theme: 'Light' | 'Dim' = 'Light';
  preferences = { emailUpdates: true, taskReminders: true, weeklyDigest: false, dealAlerts: true };
  readonly tabs = ['Profile', 'Company', 'Notifications', 'Appearance', 'Account'];
  readonly profileForm = this.fb.group({
    name: ['Admin', Validators.required], email: ['admin@omnicrm.in', [Validators.required, Validators.email]],
    phone: ['+91 98765 00000', Validators.pattern(/^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/)],
    role: ['Workspace owner', Validators.required]
  });
  readonly companyForm = this.fb.group({
    company: ['OmniCRM Demo Workspace', Validators.required], industry: ['Software & Technology', Validators.required],
    website: ['www.omnicrm.in'], address: ['Pune, Maharashtra, India', Validators.required],
    currency: ['INR (₹)', Validators.required], timezone: ['Asia/Kolkata', Validators.required]
  });

  constructor() {
    try {
      const saved = localStorage.getItem('omnicrm-settings');
      if (saved) {
        const settings = JSON.parse(saved) as {
          profile?: object;
          company?: object;
          preferences?: { emailUpdates: boolean; taskReminders: boolean; weeklyDigest: boolean; dealAlerts: boolean };
          theme?: 'Light' | 'Dim';
        };
        if (settings.profile) this.profileForm.patchValue(settings.profile);
        if (settings.company) this.companyForm.patchValue(settings.company);
        if (settings.preferences) this.preferences = { ...this.preferences, ...settings.preferences };
        if (settings.theme) this.theme = settings.theme;
      }
    } catch (error) {
      console.error('Unable to load saved OmniCRM preferences', error);
    }
    this.profileForm.patchValue({
      name: this.auth.currentUser.name,
      email: this.auth.currentUser.email
    });
    this.applyTheme();
  }

  selectTab(tab: string): void { this.activeTab = tab; this.savedMessage = ''; }
  toggle(key: keyof typeof this.preferences): void { this.preferences[key] = !this.preferences[key]; this.persist(); }
  changeTheme(theme: 'Light' | 'Dim'): void { this.theme = theme; this.applyTheme(); this.persist(); }
  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.auth.updateProfile({
      name: this.profileForm.controls.name.value!.trim(),
      email: this.profileForm.controls.email.value!.trim().toLowerCase()
    });
    this.persist('Profile information saved.');
  }
  saveCompany(): void {
    if (this.companyForm.invalid) { this.companyForm.markAllAsTouched(); return; }
    this.persist('Company information saved.');
  }
  private applyTheme(): void { document.body.classList.toggle('dim-theme', this.theme === 'Dim'); }
  private persist(message = 'Preferences saved.'): void {
    try {
      localStorage.setItem('omnicrm-settings', JSON.stringify({
        profile: this.profileForm.getRawValue(), company: this.companyForm.getRawValue(),
        preferences: this.preferences, theme: this.theme
      }));
      this.savedMessage = message;
      window.setTimeout(() => this.savedMessage = '', 3200);
    } catch (error) {
      console.error('Unable to save OmniCRM preferences', error);
      this.savedMessage = 'Could not save preferences. Check your browser storage settings.';
    }
  }
}
