export enum AuthType {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  CREDENTIALS = 'CREDENTIALS',
}

export interface User {
  id: string;
  email: string;
  password?: string | undefined;
  avatar?: string | undefined;
  fullname?: string | undefined;
  githubId?: string | undefined;
  authType: AuthType[];
  accessToken?: {
    accessToken: string;
    refreshToken?: string;
    provider: 'GITHUB' | 'GOOGLE';
  }[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserDto = {
  email: string;
  authType: AuthType;
  password?: string | undefined;
  avatar?: string | undefined;
  fullname?: string | undefined;
  accessToken?: {
    accessToken: string;
    refreshToken?: string;
    provider: 'GITHUB' | 'GOOGLE';
  };
};

export type UpdateUserDetailsDto =
  | {
      updates: Partial<User>;
      email: string;
    }
  | {
      updates: Partial<User>;
      id: string;
    };

export abstract class IUserRepository {
  abstract findUserById(id: string): Promise<User | null>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract findUserByGithubId(githubId: string): Promise<User | null>;

  abstract createUser(createUserDto: CreateUserDto): Promise<User | null>;

  abstract updateUserDetails(
    userUpdates: UpdateUserDetailsDto,
  ): Promise<User | null>;

  abstract updatePassword({
    id,
    email,
    password,
  }: {
    id: string;
    email: string;
    password: string;
  }): Promise<User | null>;
  abstract addAuthType(email: string, authType: AuthType): Promise<User>;

  abstract getAccessTokens({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }): Promise<
    { accessToken: string; refreshToken?: string; provider: string }[]
  >;
}
