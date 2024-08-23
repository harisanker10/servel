import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from 'src/config/env';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token =
      request.headers['authorization'] || request.headers['Authorization'];
    if (typeof token !== 'string') return false;
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
      });
      console.log({ user });
      if (user && 'email' in user) {
        const savedUser = await this.authService.getUser(user.email);
        delete savedUser?.password;
        console.log({ savedUser });
        if (savedUser) request.user = savedUser;
        else throw new UnauthorizedException();
        return true;
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
