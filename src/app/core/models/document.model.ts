import { Signer, CreateSignerDto } from './signer.model';

export type DocumentStatus = 'pending' | 'signed' | 'cancelled';

export interface Document {
  id: number;
  name: string;
  status: DocumentStatus;
  open_id: number | null;
  token: string | null;
  url_pdf: string | null;
  external_id: string | null;
  created_at: string;
  last_updated_at: string;
  created_by: string;
  company: number;
  signers: Signer[];
  ai_summary: string | null;
  ai_missing_topics: string[] | null;
  ai_insights: string | null;
}

export interface CreateDocumentDto {
  name: string;
  created_by: string;
  company: number;
  url_pdf: string;
  signers: CreateSignerDto[];
}

export interface UpdateDocumentDto {
  name?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
