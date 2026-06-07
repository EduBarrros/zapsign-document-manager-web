import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Signer, CreateSignerDto, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SignerService {
  private readonly baseUrl = `${environment.apiUrl}/signers`;

  constructor(private http: HttpClient) {}

  list(filters?: { document?: number; status?: string }): Observable<Signer[]> {
    const params: Record<string, string> = {};
    if (filters?.document) params['document'] = filters.document.toString();
    if (filters?.status) params['status'] = filters.status;
    return this.http
      .get<PaginatedResponse<Signer>>(`${this.baseUrl}/`, { params })
      .pipe(map((r) => r.results));
  }

  getById(id: number): Observable<Signer> {
    return this.http.get<Signer>(`${this.baseUrl}/${id}/`);
  }

  create(dto: CreateSignerDto & { document: number }): Observable<Signer> {
    return this.http.post<Signer>(`${this.baseUrl}/`, dto);
  }

  update(id: number, dto: Partial<CreateSignerDto>): Observable<Signer> {
    return this.http.patch<Signer>(`${this.baseUrl}/${id}/`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
