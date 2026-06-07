import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Signer, CreateSignerDto } from '../models';

@Injectable({ providedIn: 'root' })
export class SignerService {
  private readonly baseUrl = `${environment.apiUrl}/signers`;

  constructor(private http: HttpClient) {}

  list(documentId?: number): Observable<Signer[]> {
    if (documentId) {
      return this.http.get<Signer[]>(`${this.baseUrl}/`, {
        params: { document_id: documentId.toString() },
      });
    }
    return this.http.get<Signer[]>(`${this.baseUrl}/`);
  }

  getById(id: number): Observable<Signer> {
    return this.http.get<Signer>(`${this.baseUrl}/${id}/`);
  }

  create(documentId: number, dto: CreateSignerDto): Observable<Signer> {
    return this.http.post<Signer>(`${this.baseUrl}/`, { ...dto, document_id: documentId });
  }

  update(id: number, dto: Partial<CreateSignerDto>): Observable<Signer> {
    return this.http.patch<Signer>(`${this.baseUrl}/${id}/`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
