import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-shield-lock fs-3"></i>
                <div>
                  <h1 class="h4 mb-0">Welcome back</h1>
                  <small class="text-muted">Sign in to access your dashboard</small>
                </div>
              </div>

              <form [formGroup]="form" (ngSubmit)="onLogin()" novalidate>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input class="form-control" type="email" formControlName="email" placeholder="name@gmail.com" />
                  <div class="text-danger small mt-1" *ngIf="emailInvalid()">
                    Please enter a valid email.
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label">Password</label>
                  <input class="form-control" type="password" formControlName="password" placeholder="••••••••" />
                  <div class="text-danger small mt-1" *ngIf="passwordInvalid()">
                    Password must be 7+ chars, include 1 uppercase, 1 number, and be letters/numbers only.
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="remember" />
                    <label class="form-check-label" for="remember">Remember me</label>
                  </div>

                  <button type="button" class="btn btn-link px-0" (click)="openForgot()">
                    Forgot password?
                  </button>
                </div>

                <button class="btn btn-primary w-100 py-2" [disabled]="form.invalid || loading()">
                  <span *ngIf="!loading()">Login</span>
                  <span *ngIf="loading()">Logging in...</span>
                </button>

                <div class="alert alert-danger mt-3 mb-0" *ngIf="error()">
                  {{ error() }}
                </div>
                <div class="alert alert-success mt-3 mb-0" *ngIf="success()">
                  {{ success() }}
                </div>

                <hr class="my-4" />

                <div class="text-center text-muted small">
                  Don’t have an account?
                </div>

                <button type="button" class="btn btn-outline-secondary w-100 mt-2" (click)="onSignup()"
                        [disabled]="form.invalid || loading()">
                  Create account
                </button>

                <div class="text-muted small mt-3">
                  <strong>Password rules:</strong>
                  <ul class="mb-0">
                    <li>7+ characters</li>
                    <li>At least 1 uppercase letter</li>
                    <li>At least 1 number</li>
                    <li>Letters/numbers only</li>
                  </ul>
                </div>
              </form>
            </div>
          </div>

          <p class="text-center text-muted small mt-3 mb-0">
            © {{ year }} Your App • Secure sign-in
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Forgot Password Modal (Bootstrap) -->
  <div class="modal fade" id="forgotModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4">
        <div class="modal-header">
          <h5 class="modal-title">Reset password</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-3">
            Enter your email and we’ll send a password reset link.
          </p>
          <input class="form-control" type="email" [value]="form.value.email || ''"
                 (input)="forgotEmail = ($any($event.target).value)" placeholder="name@gmail.com" />
          <div class="text-danger small mt-2" *ngIf="forgotError()">{{ forgotError() }}</div>
          <div class="text-success small mt-2" *ngIf="forgotSuccess()">{{ forgotSuccess() }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary" (click)="sendReset()" [disabled]="loadingReset()">
            <span *ngIf="!loadingReset()">Send link</span>
            <span *ngIf="loadingReset()">Sending...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class LoginComponent {
  year = new Date().getFullYear();

  loading = signal(false);
  loadingReset = signal(false);
  error = signal('');
  success = signal('');

  forgotEmail = '';
  forgotError = signal('');
  forgotSuccess = signal('');

  // 7+ chars, 1 uppercase, 1 number, alphanumeric only
  private passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]{7,}$/;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  emailInvalid() {
    const c = this.form.controls['email'];
    return c.touched && c.invalid;
  }
  
  passwordInvalid() {
    const c = this.form.controls['password'];
    return c.touched && c.invalid;
  }

  async onLogin() {
    this.error.set('');
    this.success.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const email = String(this.form.value.email ?? '').trim();
      const password = String(this.form.value.password ?? '');

      await this.auth.login(email, password);
      this.router.navigateByUrl('/landing');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }

  async onSignup() {
    this.error.set('');
    this.success.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const email = String(this.form.value.email ?? '').trim();
      const password = String(this.form.value.password ?? '');

      await this.auth.signup(email, password);
      this.success.set('Account created. You can now log in.');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Signup failed');
    } finally {
      this.loading.set(false);
    }
  }

  openForgot() {
    this.forgotError.set('');
    this.forgotSuccess.set('');
    this.forgotEmail = String(this.form.value.email ?? '').trim();

    const el = document.getElementById('forgotModal');
    if (!el) return;

    // Bootstrap modal
    // @ts-ignore
    const modal = new (window as any).bootstrap.Modal(el);
    modal.show();
  }

  async sendReset() {
    this.forgotError.set('');
    this.forgotSuccess.set('');

    const email = (this.forgotEmail || '').trim();
    if (!email) {
      this.forgotError.set('Please enter your email.');
      return;
    }

    this.loadingReset.set(true);
    try {
      await this.auth.forgotPassword(email);
      this.forgotSuccess.set('Reset link sent. Check your inbox (and spam).');
    } catch (e: any) {
      this.forgotError.set(e?.message ?? 'Could not send reset email.');
    } finally {
      this.loadingReset.set(false);
    }
  }
}



