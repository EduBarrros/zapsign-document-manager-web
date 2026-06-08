export interface Company {
  id: number;
  name: string;
  created_at: string;
  last_updated_at: string;
}

export interface CreateCompanyDto {
  name: string;
  api_token: string;
}

export interface UpdateCompanyDto {
  name?: string;
  api_token?: string;
}
