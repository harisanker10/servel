export interface User {
  id: string;
  email: string;
  password?: string | undefined;
  fullname?: string | undefined;
  avatar?: string | undefined;
  githubId?: string | undefined;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  authType: string[];
  accessTokens?: AccessTokens | undefined;
}

export interface AccessTokens {
  accessToken: string;
  refreshToken?: string;
  provider: string;
}
export enum AuthType {
  CREDENTIALS = "CREDENTIALS",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}
