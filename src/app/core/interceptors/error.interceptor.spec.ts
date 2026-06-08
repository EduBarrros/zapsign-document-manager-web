import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let errorSpy: jest.Mock;

  beforeEach(() => {
    errorSpy = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: NotificationService,
          useValue: { error: errorSpy, success: jest.fn(), info: jest.fn() },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('should display API error message when error.error.message is present', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({ error: { message: 'Token da empresa inválido' } }, { status: 400, statusText: 'Bad Request' });

    expect(errorSpy).toHaveBeenCalledWith('Token da empresa inválido');
  });

  it('should display detail message when error.error.detail is present', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({ detail: 'Não encontrado.' }, { status: 404, statusText: 'Not Found' });

    expect(errorSpy).toHaveBeenCalledWith('Não encontrado.');
  });

  it('should show "Não autorizado" on 401', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(errorSpy).toHaveBeenCalledWith('Não autorizado. Faça login novamente.');
  });

  it('should show "Acesso negado" on 403', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({}, { status: 403, statusText: 'Forbidden' });

    expect(errorSpy).toHaveBeenCalledWith('Acesso negado.');
  });

  it('should show "Recurso não encontrado" on 404', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({}, { status: 404, statusText: 'Not Found' });

    expect(errorSpy).toHaveBeenCalledWith('Recurso não encontrado.');
  });

  it('should show "Sem conexão" on status 0 (network error)', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .error(new ProgressEvent('error'), { status: 0, statusText: '' });

    expect(errorSpy).toHaveBeenCalledWith('Sem conexão com o servidor.');
  });

  it('should show generic message for unhandled errors', () => {
    http.get('/api/test/').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/test/')
      .flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(errorSpy).toHaveBeenCalledWith('Ocorreu um erro inesperado.');
  });

  it('should re-throw the error after displaying the notification', done => {
    http.get('/api/test/').subscribe({
      error: err => {
        expect(err.status).toBe(400);
        done();
      },
    });

    httpMock
      .expectOne('/api/test/')
      .flush({}, { status: 400, statusText: 'Bad Request' });
  });
});
