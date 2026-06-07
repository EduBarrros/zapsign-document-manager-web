import { Signer, CreateSignerDto } from './signer.model';

export interface Document {
  id: number;
  open_id: number;
  token: string;
  name: string;
  status: string;
  created_at: string;
  last_updated_at: string;
  created_by: string;
  company_id: number;
  external_id?: string;
  pdf_url?: string;
  signers: Signer[];
  ai_analysis?: AiAnalysis;
}

export interface AiAnalysis {
  summary: string;
  missing_topics: string[];
  insights: string[];
  analyzed_at: string;
}

export interface CreateDocumentDto {
  name: string;
  pdf_url: string;
  company_id: number;
  external_id?: string;
  signers: CreateSignerDto[];
}

export interface UpdateDocumentDto {
  name?: string;
  status?: string;
}
