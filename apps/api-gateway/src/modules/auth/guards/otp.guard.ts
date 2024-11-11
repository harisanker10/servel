import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class OtpGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { otp, email } = request.body;
    if (!otp) {
      throw new BadRequestException('Invalid Otp');
    }
    if (!email) {
      throw new BadRequestException('Invalid email');
    }
    const valid = this.authService.validateOtp(otp, email);
    if (!valid) {
      throw new UnauthorizedException('Invalid Otp');
    }
    return true;
  }
}
