import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer.service';
import { OtpService } from 'src/utils/otp.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  generateJWT({ id, email }: { id: string; email: string }) {
    return this.jwtService.signAsync({
      id,
      email,
    });
  }

  getJWTPaylod(token: string): Promise<{ email: string; id: string }> {
    return this.jwtService.verifyAsync(token);
  }

  generateOtpForEmail(email: string) {
    return this.otpService.generateOtp(email);
  }

  validateOtp(otp: string, email: string) {
    return this.otpService.checkValidity(email, otp);
  }

  async verifyUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.getUser(email);
    if (!user || !user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async sendOtpEmail(email: string) {
    const { otp, validity } = this.otpService.generateOtp(email);
    const sent = await this.mailerService.sendVerificationCode(email, otp);
    if (!sent) {
      return null;
    }
    return { otp, validity };
  }
}
