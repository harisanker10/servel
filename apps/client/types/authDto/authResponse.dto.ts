export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  password?: string | undefined;
  fullname?: string | undefined;
  avatar?: string | undefined;
  githubId?: string | undefined;
  isBlocked: boolean;
  isProMember: boolean;
  createdAt: number;
  updatedAt: number;
}
