import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export type User = {
  id: string;
  full_name: string;
  email: string;
  location: { id: number; name: string };
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();

  constructor() {
    this.getAuthInfo();
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ user: User; access_token: string }>(
        '/api/v1/auth/login',
        credentials
      )
      .pipe(
        tap(({ user, access_token }) => {
          this.setAuthInfo(user, access_token);
        })
      );
  }

  logout() {
    this.deleteAuthInfo();
    this.router.navigate(['/login']);
  }

  register(user: {
    full_name: string;
    location: string;
    email: string;
    password: string;
  }) {
    return this.http.post('/api/v1/auth/register', user);
  }

  sendPasswordResetEmail(email: string) {
    return this.http.post('/api/v1/auth/send-password-reset-email', { email });
  }

  resetPassword(id: string, code: string, password: string) {
    return this.http.post('/api/v1/auth/reset-password', {
      id,
      code,
      password,
    });
  }

  private getAuthInfo() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user === null) return;
    this.userSignal.set(JSON.parse(user) as User);
    this.tokenSignal.set(token);
  }

  private setAuthInfo(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.userSignal.set(user);
    this.tokenSignal.set(token);
  }

  private deleteAuthInfo() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSignal.set(null);
    this.tokenSignal.set(null);
  }
}
