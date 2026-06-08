import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  PaginatedResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  list(filters?: { company?: number; status?: string }): Observable<Document[]> {
    const params: Record<string, string> = {};
    if (filters?.company) params['company'] = filters.company.toString();
    if (filters?.status) params['status'] = filters.status;
    return this.http
      .get<PaginatedResponse<Document>>(`${this.baseUrl}/`, { params })
      .pipe(map((r) => r.results));
  }

  listPaginated(
    page = 0,
    pageSize = 10,
    filters?: { company?: number; status?: string }
  ): Observable<PaginatedResponse<Document>> {
    const params: Record<string, string> = {
      page: (page + 1).toString(),
      page_size: pageSize.toString(),
    };
    if (filters?.company) params['company'] = filters.company.toString();
    if (filters?.status) params['status'] = filters.status;
    return this.http.get<PaginatedResponse<Document>>(`${this.baseUrl}/`, { params });
  }

  getById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/${id}/`);
  }

  create(dto: CreateDocumentDto): Observable<Document> {
    return this.http.post<Document>(`${this.baseUrl}/`, dto);
  }

  update(id: number, dto: UpdateDocumentDto): Observable<Document> {
    return this.http.patch<Document>(`${this.baseUrl}/${id}/`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }

  reanalyze(id: number): Observable<Document> {
    return this.http.post<Document>(`${this.baseUrl}/${id}/analyze/`, {});
  }
}
