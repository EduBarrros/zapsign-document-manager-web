export interface LoginDto {
  email: string;
  password: string;
}

// DRF token auth returns { token }, dj-rest-auth returns { key }
export interface LoginResponse {
  token?: string;
  key?: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
}
