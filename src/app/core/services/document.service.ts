import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Document, CreateDocumentDto, UpdateDocumentDto, AiAnalysis } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  list(companyId?: number): Observable<Document[]> {
    if (companyId) {
      return this.http.get<Document[]>(`${this.baseUrl}/`, {
        params: { company_id: companyId.toString() },
      });
    }
    return this.http.get<Document[]>(`${this.baseUrl}/`);
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

  reanalyze(id: number): Observable<AiAnalysis> {
    return this.http.post<AiAnalysis>(`${this.baseUrl}/${id}/analyze/`, {});
  }

  getReport(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/report/`, { responseType: 'blob' });
  }
}
