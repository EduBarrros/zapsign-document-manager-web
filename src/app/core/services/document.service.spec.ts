import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { environment } from '../../../environments/environment';
import { Document } from '../models';

const mockDocument: Document = {
  id: 1,
  name: 'Contrato de Serviço',
  status: 'pending',
  open_id: 42,
  token: 'zaptok123',
  url_pdf: 'https://example.com/doc.pdf',
  external_id: null,
  created_at: '2024-01-01T00:00:00Z',
  last_updated_at: '2024-01-01T00:00:00Z',
  created_by: 'user@test.com',
  company: 1,
  signers: [],
  ai_summary: null,
  ai_missing_topics: null,
  ai_insights: null,
};

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/documents`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should GET documents and extract results from paginated response', () => {
      service.list().subscribe(docs => {
        expect(docs).toEqual([mockDocument]);
      });

      const req = httpMock.expectOne(`${baseUrl}/`);
      expect(req.request.method).toBe('GET');
      req.flush({ count: 1, next: null, previous: null, results: [mockDocument] });
    });

    it('should pass company filter as query param', () => {
      service.list({ company: 5 }).subscribe();

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/` && r.params.get('company') === '5');
      expect(req.request.params.get('company')).toBe('5');
      req.flush({ count: 0, results: [] });
    });

    it('should pass status filter as query param', () => {
      service.list({ status: 'signed' }).subscribe();

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/` && r.params.get('status') === 'signed');
      expect(req.request.params.get('status')).toBe('signed');
      req.flush({ count: 0, results: [] });
    });

    it('should pass both filters when provided together', () => {
      service.list({ company: 2, status: 'pending' }).subscribe();

      const req = httpMock.expectOne(
        r => r.url === `${baseUrl}/` && r.params.get('company') === '2' && r.params.get('status') === 'pending'
      );
      req.flush({ count: 0, results: [] });
    });
  });

  describe('getById', () => {
    it('should GET a single document by id', () => {
      service.getById(1).subscribe(doc => {
        expect(doc).toEqual(mockDocument);
      });

      httpMock.expectOne(`${baseUrl}/1/`).flush(mockDocument);
    });
  });

  describe('create', () => {
    it('should POST to documents endpoint', () => {
      const dto = {
        name: 'Contrato',
        created_by: 'user@test.com',
        company: 1,
        url_pdf: 'https://example.com/doc.pdf',
        signers: [{ name: 'João', email: 'joao@test.com' }],
      };

      service.create(dto).subscribe(doc => {
        expect(doc).toEqual(mockDocument);
      });

      const req = httpMock.expectOne(`${baseUrl}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockDocument);
    });
  });

  describe('update', () => {
    it('should PATCH document name', () => {
      service.update(1, { name: 'Contrato Atualizado' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/1/`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'Contrato Atualizado' });
      req.flush(mockDocument);
    });
  });

  describe('delete', () => {
    it('should DELETE document by id', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/1/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('reanalyze', () => {
    it('should POST to analyze endpoint and return updated document', () => {
      const analyzed = { ...mockDocument, ai_summary: 'Resumo gerado pela IA.' };

      service.reanalyze(1).subscribe(doc => {
        expect(doc.ai_summary).toBe('Resumo gerado pela IA.');
      });

      const req = httpMock.expectOne(`${baseUrl}/1/analyze/`);
      expect(req.request.method).toBe('POST');
      req.flush(analyzed);
    });
  });
});
