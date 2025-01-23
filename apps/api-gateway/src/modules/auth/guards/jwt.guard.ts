import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  private logger: Logger;
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.logger = new Logger(JWTGuard.name);
  }
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
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }
}
