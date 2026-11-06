import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const passwordsMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmation = control.get('confirmPassword')?.value;
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  showPassword = false;
  showConfirmation = false;
  submitting = false;
  errorMessage = '';

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
    rememberMe: [true]
  }, { validators: passwordsMatch });

  get passwordsDoNotMatch(): boolean {
    return this.form.hasError('passwordMismatch') && this.form.controls.confirmPassword.touched;
  }

  async signUp(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    try {
      await this.auth.createAccount({
        name: this.form.controls.name.value!.trim(),
        email: this.form.controls.email.value!.trim().toLowerCase()
      }, this.form.controls.password.value!, this.form.controls.rememberMe.value ?? false);
      void this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error('Unable to create the local OmniCRM demo session', error);
      this.errorMessage = error instanceof Error && error.message.startsWith('An account with this email')
        ? error.message
        : 'Could not create your account. Check your browser storage settings and try again.';
      this.submitting = false;
    }
  }
}
