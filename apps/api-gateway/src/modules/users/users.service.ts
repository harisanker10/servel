import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthType,
  USER_SERVICE_NAME,
  UserServiceClient,
  User,
} from '@servel/proto/users';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createUserWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await lastValueFrom(
      this.userService.createUser({
        email,
        password: hashedPassword,
        authType: AuthType.CREDENTIALS,
      }),
    );
    return newUser;
  }

  async updateEmail({ id, email }: { id: string; email: string }) {
    return lastValueFrom(
      this.userService.updateUser({ id, updates: { email } }),
    );
  }

  async createUserWithOAuth(user: {
    email: string;
    avatar?: string | undefined;
    fullname?: string | undefined;
    githubId?: string | undefined;
    accessToken: string;
    refreshToken: string;
    authType: AuthType;
  }): Promise<User> {
    return lastValueFrom(
      this.userService.createUser({
        email: user.email,
        fullname: user.fullname,
        avatar: user.avatar,
        githubId: user.githubId,
        accessToken: {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          provider: user.authType,
        },
        authType: user.authType,
      }),
    );
  }

  async resetPassword(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await lastValueFrom(
      this.userService.updateUser({
        email,
        updates: { password: hashedPassword },
      }),
    );
    if (newUser.password === hashedPassword) return true;
    return false;
  }

  async updateFullname(id: string, fullname: string) {
    return this.userService.updateUser({ id, updates: { fullname } });
  }

  async getAccessTokens(id?: string, email?: string) {
    return this.userService.getAccessTokens({ email, id });
  }

  async getUser(
    email?: string | undefined,
    id?: string | undefined,
  ): Promise<User | null> {
    try {
      if (email) {
        const user = await lastValueFrom(
          this.userService.findOneUser({ email }),
        );
        return user;
      } else {
        const user = await lastValueFrom(this.userService.findOneUser({ id }));
        return user;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
