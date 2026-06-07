export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
}
