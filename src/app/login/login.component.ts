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
    <div class="login-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="login-col">
            <div class="card login-card">
              <div class="card-body login-card-body">

                <div class="login-header">
                  <i class="bi bi-shield-lock login-icon"></i>
                  <div>
                    <h1 class="login-title">Welcome back</h1>
                    <small class="text-muted">Sign in to access your dashboard</small>
                  </div>
                </div>

                <form [formGroup]="form" (ngSubmit)="onLogin()" novalidate>

                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input class="form-control" type="email" formControlName="email" placeholder="name@gmail.com" />
                    <div class="text-danger small" *ngIf="emailInvalid()">
                      Please enter a valid email.
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <input class="form-control" type="password" formControlName="password" placeholder="••••••••" />
                    <div class="text-danger small" *ngIf="passwordInvalid()">
                      Password must be 7+ chars, include 1 uppercase, 1 number, and be letters/numbers only.
                    </div>
                  </div>

                  <div class="login-options">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="remember" />
                      <label class="form-check-label" for="remember">Remember me</label>
                    </div>

                    <button type="button" class="btn btn-link p-0" (click)="openForgot()">
                      Forgot password?
                    </button>
                  </div>

                  <button class="btn btn-primary w-100 py-2" [disabled]="form.invalid || loading()">
                    {{ loading() ? 'Logging in…' : 'Login' }}
                  </button>

                  <div class="alert alert-danger mt-3" *ngIf="error()">{{ error() }}</div>
                  <div class="alert alert-success mt-3" *ngIf="success()">{{ success() }}</div>

                  <hr class="my-4" />

                  <button
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    (click)="onSignup()"
                    [disabled]="form.invalid || loading()">
                    Create account
                  </button>

                  <div class="password-rules">
                    <strong>Password rules:</strong>
                    <ul>
                      <li>7+ characters</li>
                      <li>At least 1 uppercase letter</li>
                      <li>At least 1 number</li>
                      <li>Letters/numbers only</li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>

            <p class="login-footer">
              © {{ year }} Your App • Secure sign-in
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal fade" id="forgotModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title">Reset password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p class="text-muted">
              Enter your email and we’ll send a password reset link.
            </p>

            <input
              class="form-control"
              type="email"
              [value]="form.value.email || ''"
              (input)="forgotEmail = ($any($event.target).value)"
              placeholder="name@gmail.com"
            />

            <div class="text-danger small mt-2" *ngIf="forgotError()">{{ forgotError() }}</div>
            <div class="text-success small mt-2" *ngIf="forgotSuccess()">{{ forgotSuccess() }}</div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" (click)="sendReset()" [disabled]="loadingReset()">
              {{ loadingReset() ? 'Sending…' : 'Send link' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
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

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });

    // ✅ If already logged in, don't show login page
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/landing');
    }
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

      // ✅ This must set whatever AuthService uses for isLoggedIn()
      await this.auth.login(email, password);

      // Optional: if your AuthService stores email separately
      if ((this.auth as any).setEmail) {
        (this.auth as any).setEmail(email);
      }

      // ✅ Go to landing (guard will allow if isLoggedIn() is true)
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

      // You can either auto-login after signup OR ask them to login.
      // Here we keep your current behavior:
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





