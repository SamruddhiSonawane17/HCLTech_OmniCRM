import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  showPassword = false;
  showRecoveryMessage = false;
  submitting = false;
  signInError = '';
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [true]
  });

  async signIn(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.signInError = '';
    try {
      const email = this.form.controls.email.value!.trim().toLowerCase();
      const account = await this.auth.authenticate(email, this.form.controls.password.value!);
      if (account === 'account-not-found') {
        this.signInError = 'No account found for this email. Create an account first.';
        this.submitting = false;
        return;
      }
      if (account === 'wrong-password') {
        this.signInError = 'Password is wrong.';
        this.submitting = false;
        return;
      }

      this.auth.signIn(this.form.controls.rememberMe.value ?? false, account);
      void this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error('Unable to create the local OmniCRM demo session', error);
      this.signInError = 'Could not sign in. Check your browser storage settings and try again.';
      this.submitting = false;
    }
  }
}
