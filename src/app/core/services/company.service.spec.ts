import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { environment } from '../../../environments/environment';
import { Company } from '../models';

const mockCompany: Company = {
  id: 1,
  name: 'Empresa Teste',
  created_at: '2024-01-01T00:00:00Z',
  last_updated_at: '2024-01-01T00:00:00Z',
};

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/companies`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CompanyService);
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
    it('should GET companies and extract results from paginated response', () => {
      const paginated = { count: 1, next: null, previous: null, results: [mockCompany] };

      service.list().subscribe(companies => {
        expect(companies).toHaveLength(1);
        expect(companies[0]).toEqual(mockCompany);
      });

      const req = httpMock.expectOne(`${baseUrl}/`);
      expect(req.request.method).toBe('GET');
      req.flush(paginated);
    });

    it('should return empty array when no companies exist', () => {
      service.list().subscribe(companies => {
        expect(companies).toEqual([]);
      });

      httpMock.expectOne(`${baseUrl}/`).flush({ count: 0, next: null, previous: null, results: [] });
    });
  });

  describe('getById', () => {
    it('should GET a single company by id', () => {
      service.getById(1).subscribe(company => {
        expect(company).toEqual(mockCompany);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompany);
    });
  });

  describe('create', () => {
    it('should POST to companies endpoint with correct body', () => {
      const dto = { name: 'Nova Empresa', api_token: 'token_abc' };

      service.create(dto).subscribe(result => {
        expect(result).toEqual(mockCompany);
      });

      const req = httpMock.expectOne(`${baseUrl}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockCompany);
    });
  });

  describe('update', () => {
    it('should PATCH to companies/:id with updated fields', () => {
      const dto = { name: 'Empresa Atualizada' };

      service.update(1, dto).subscribe(result => {
        expect(result.name).toBe(mockCompany.name);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(mockCompany);
    });
  });

  describe('delete', () => {
    it('should DELETE to companies/:id', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/1/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
