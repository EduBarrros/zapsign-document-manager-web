import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const dto = { email: 'user@test.com', password: 'secret' };

    it('should POST to auth/login/', () => {
      service.login(dto).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush({ token: 'tok123' });
    });

    it('should store token (DRF format) on successful login', () => {
      service.login(dto).subscribe();
      httpMock.expectOne(`${baseUrl}/login/`).flush({ token: 'tok123' });

      expect(localStorage.getItem('auth_token')).toBe('tok123');
    });

    it('should support dj-rest-auth key format', () => {
      service.login(dto).subscribe();
      httpMock.expectOne(`${baseUrl}/login/`).flush({ key: 'key456' });

      expect(localStorage.getItem('auth_token')).toBe('key456');
    });

    it('should store email on successful login', () => {
      service.login(dto).subscribe();
      httpMock.expectOne(`${baseUrl}/login/`).flush({ token: 'tok123' });

      expect(localStorage.getItem('auth_email')).toBe('user@test.com');
    });

    it('should NOT store token when response has neither token nor key', () => {
      service.login(dto).subscribe();
      httpMock.expectOne(`${baseUrl}/login/`).flush({});

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('signup', () => {
    it('should POST to auth/signup/ and store token', () => {
      const dto = { username: 'john', email: 'john@test.com', password: 'pass' };
      service.signup(dto).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/signup/`);
      expect(req.request.method).toBe('POST');
      req.flush({ token: 'newtoken' });

      expect(localStorage.getItem('auth_token')).toBe('newtoken');
      expect(localStorage.getItem('auth_email')).toBe('john@test.com');
    });
  });

  describe('logout', () => {
    it('should remove token and email from localStorage', () => {
      localStorage.setItem('auth_token', 'tok123');
      localStorage.setItem('auth_email', 'user@test.com');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_email')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token is present', () => {
      localStorage.setItem('auth_token', 'tok123');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getEmail', () => {
    it('should return the stored email', () => {
      localStorage.setItem('auth_email', 'user@test.com');
      expect(service.getEmail()).toBe('user@test.com');
    });

    it('should return null when no email is stored', () => {
      expect(service.getEmail()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return the stored token', () => {
      localStorage.setItem('auth_token', 'tok123');
      expect(service.getToken()).toBe('tok123');
    });

    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });
  });
});
