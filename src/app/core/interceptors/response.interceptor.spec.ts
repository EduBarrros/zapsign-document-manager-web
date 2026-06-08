import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { responseInterceptor } from './response.interceptor';

describe('responseInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([responseInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should unwrap data field from API envelope', done => {
    const payload = { id: 1, name: 'Empresa' };

    http.get('/api/companies/').subscribe(result => {
      expect(result).toEqual(payload);
      done();
    });

    httpMock.expectOne('/api/companies/').flush({ data: payload, error: null });
  });

  it('should pass through responses that have no data envelope', done => {
    const body = { token: 'abc123' };

    http.get('/api/auth/login/').subscribe(result => {
      expect(result).toEqual(body);
      done();
    });

    httpMock.expectOne('/api/auth/login/').flush(body);
  });

  it('should pass through null body without modification', done => {
    http.delete('/api/companies/1/').subscribe(result => {
      expect(result).toBeNull();
      done();
    });

    httpMock.expectOne('/api/companies/1/').flush(null);
  });

  it('should unwrap nested data correctly', done => {
    const nested = { results: [{ id: 1 }, { id: 2 }], count: 2 };

    http.get('/api/documents/').subscribe(result => {
      expect(result).toEqual(nested);
      done();
    });

    httpMock.expectOne('/api/documents/').flush({ data: nested, error: null });
  });
});
