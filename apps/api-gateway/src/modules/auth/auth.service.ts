import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserWithGoogleDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@servel/dto';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { CreateUserWithCredentialsDto } from '@servel/dto';
import { MailerService } from 'src/mailer.service';
import { OtpService } from 'src/utils/otp.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(
    @Inject('users') private client: ClientGrpc,
    private readonly mailerService: MailerService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}
  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createUserWithEmail(
    { email, password }: CreateUserWithCredentialsDto,
    otp: string,
  ) {
    const verified = this.otpService.checkValidity(email, otp);
    if (!verified) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    //if user exist userService will throw rpc error
    const newUser = await lastValueFrom(
      this.userService.createUserWithCredentials({
        email,
        password: hashedPassword,
      }),
    );
    return newUser;
  }

  async createUserWithGoogle(user: CreateUserWithGoogleDto) {
    return lastValueFrom(this.userService.createUserWithGoogle(user));
  }

  async signup(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await lastValueFrom(
      this.userService.createUserWithCredentials({
        email,
        password: hashedPassword,
      }),
    );
    delete user.password;
    return user;
  }

  async resetPassword(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await lastValueFrom(
      this.userService.updateUser({ email, password: hashedPassword }),
    );
    if (newUser.password === hashedPassword) return true;
    return false;
  }

  generateJWT({ id, email }: { id: string; email: string }) {
    return this.jwtService.signAsync({
      id,
      email,
    });
  }

  async verifyUser(email: string, password: string): Promise<boolean> {
    const user = await lastValueFrom(this.userService.findOneUser({ email }));
    if (!user || !user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  generateOtpForEmail(email: string) {
    return this.otpService.generateOtp(email);
  }

  validateOtp(otp: string, email: string) {
    return this.otpService.checkValidity(email, otp);
  }

  async sendOtpEmail(email: string) {
    const { otp, validity } = this.otpService.generateOtp(email);
    const sent = await this.mailerService.sendVerificationCode(email, otp);
    if (!sent) {
      return null;
    }
    return { otp, validity };
  }

  async getUser(email: string) {
    try {
      const user = await lastValueFrom(this.userService.findOneUser({ email }));
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
