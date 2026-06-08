import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginDto, LoginResponse, SignupDto } from '../models';

const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, dto).pipe(
      tap((res) => {
        this.storeToken(res);
        localStorage.setItem(EMAIL_KEY, dto.email);
      })
    );
  }

  signup(dto: SignupDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/signup/`, dto).pipe(
      tap((res) => {
        this.storeToken(res);
        localStorage.setItem(EMAIL_KEY, dto.email);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.router.navigate(['/login']);
  }

  getEmail(): string | null {
    return localStorage.getItem(EMAIL_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // DRF token auth → { token }, dj-rest-auth → { key }
  private storeToken(res: LoginResponse): void {
    const value = res.token ?? res.key;
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      console.error('[AuthService] Token não encontrado na resposta:', res);
    }
  }
}
