import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);

  user: User | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (u) => (this.user = u));
  }

  async signup(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async forgotPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  async logout() {
    await signOut(this.auth);
  }

  isLoggedIn() {
    return !!this.auth.currentUser;
  }

  getEmail() {
    return this.auth.currentUser?.email ?? '';
  }
}
