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
      const user = await this.authService.getJWTPaylod(token);
      if (user && 'email' in user) {
        request.user = user;
        // const savedUser = await this.authService.getUser(user.email);
        // delete savedUser?.password;
        // if (savedUser)
        //   // request.user = { id: savedUser.id, email: savedUser.email };
        // else throw new UnauthorizedException();
        return true;
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
