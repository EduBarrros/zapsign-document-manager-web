import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyDto, UpdateCompanyDto, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly baseUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  list(): Observable<Company[]> {
    return this.http
      .get<PaginatedResponse<Company>>(`${this.baseUrl}/`)
      .pipe(map((r) => r.results));
  }

  listPaginated(page = 0, pageSize = 10): Observable<PaginatedResponse<Company>> {
    const params = { page: (page + 1).toString(), page_size: pageSize.toString() };
    return this.http.get<PaginatedResponse<Company>>(`${this.baseUrl}/`, { params });
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}/`);
  }

  create(dto: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/`, dto);
  }

  update(id: number, dto: UpdateCompanyDto): Observable<Company> {
    return this.http.patch<Company>(`${this.baseUrl}/${id}/`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
