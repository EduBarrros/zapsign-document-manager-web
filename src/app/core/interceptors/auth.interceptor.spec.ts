import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should add Authorization header when token is stored', () => {
    localStorage.setItem('auth_token', 'mytoken123');

    http.get('/api/test/').subscribe();

    const req = httpMock.expectOne('/api/test/');
    expect(req.request.headers.get('Authorization')).toBe('Token mytoken123');
    req.flush({});
  });

  it('should NOT add Authorization header when no token is stored', () => {
    localStorage.removeItem('auth_token');

    http.get('/api/test/').subscribe();

    const req = httpMock.expectOne('/api/test/');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should NOT add Authorization header when token is the string "undefined"', () => {
    localStorage.setItem('auth_token', 'undefined');

    http.get('/api/test/').subscribe();

    const req = httpMock.expectOne('/api/test/');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should forward the request unchanged when no token', () => {
    http.get('/api/test/', { params: { page: '2' } }).subscribe();

    const req = httpMock.expectOne(r => r.url === '/api/test/' && r.params.get('page') === '2');
    expect(req.request.params.get('page')).toBe('2');
    req.flush({});
  });
});
