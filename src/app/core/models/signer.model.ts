export type SignerStatus = 'pending' | 'signed' | 'rejected';

export interface Signer {
  id: number;
  name: string;
  email: string;
  token: string | null;
  external_id: string | null;
  status: SignerStatus;
  sign_url: string | null;
}

export interface CreateSignerDto {
  name: string;
  email: string;
}
