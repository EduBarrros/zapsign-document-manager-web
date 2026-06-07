export interface Signer {
  id: number;
  token: string;
  status: string;
  name: string;
  email: string;
  external_id?: string;
  document_id: number;
}

export interface CreateSignerDto {
  name: string;
  email: string;
  external_id?: string;
}
