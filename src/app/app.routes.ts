import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'landing', component: LandingComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' },
  ];
  