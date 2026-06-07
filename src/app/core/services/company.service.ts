import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly baseUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  list(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl);
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
