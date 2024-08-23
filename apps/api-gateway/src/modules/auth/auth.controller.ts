import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer.service';
import { ClientGrpc } from '@nestjs/microservices';
import { UserControllerErrorHandlingInterceptor } from './filters/userControllerExceptionHandler';
import { OtpService } from 'src/utils/otp.service';
import {
  LoginRequestDto,
  ResetPasswordDto,
  SignupRequestDto,
  SignupResponseDto,
  USER_SERVICE_NAME,
  User,
  UserServiceClient,
  resetPasswordSchema,
  signupAuthSchema,
} from '@servel/dto';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { OtpGuard } from './guards/otp.guard';
import { AuthService } from './auth.service';
import { ZodPipe } from '../../pipes/zodValidation.pipe';
import { JWTGuard } from './guards/jwt.guard';

@UseInterceptors(UserControllerErrorHandlingInterceptor)
@Controller('auth')
export class AuthController implements OnModuleInit {
  private userService: UserServiceClient;
  private createUserFns: Record<string, any>;
  constructor(
    @Inject('users') private client: ClientGrpc,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private otpService: OtpService,
    private readonly authService: AuthService,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Post('/signup')
  @UsePipes(new ZodPipe(signupAuthSchema))
  @UseGuards(OtpGuard)
  async signup(
    @Body()
    signupDto: SignupRequestDto,
  ): Promise<SignupResponseDto> {
    const { email, password } = signupDto;
    const newUser = await this.authService.signup(email, password);
    const token = await this.authService.generateJWT({
      id: newUser.id,
      email: newUser.email,
    });
    return { token, user: newUser };
  }

  @Get('/user')
  @UseGuards(JWTGuard)
  async getUser(@Req() req: any) {
    if (req.user) {
      return req.user;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/password')
  @UsePipes(new ZodPipe(resetPasswordSchema))
  @UseGuards(OtpGuard)
  async updatePassword(@Body() body: ResetPasswordDto) {
    console.log('patching password', body);
    const { email, password } = body;
    this.authService.resetPassword(email, password);
  }

  @Get('/exist/:email')
  async chechUserExist(@Param('email') email: string) {
    console.log({ email });
    const user = await this.authService.getUser(email);
    if (user && 'email' in user) {
      return { exist: true };
    }
    return { exist: false };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Query('state') state: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    let user: User | null;
    let token: string;
    let error: string;
    const { email, picture: avatar, name: fullname } = req.user;
    if (state === 'signup') {
      user = await this.authService.getUser(email);
      if (user) {
        error = 'User already exist. Try login';
      } else {
        user = await this.authService.createUserWithGoogle({
          email,
          avatar,
          fullname,
        });
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    } else if (state === 'login') {
      user = await this.authService.getUser(email);
      if (!user) {
        error = 'User not found';
      }
      if (user && !user?.authType?.includes('google')) {
        error = 'Not authenticated with google';
      }
      if (user) {
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    }

    //@ts-expect-error token undefined
    if (user && token) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ user, token })}', 'http://localhost:3000')</script>`,
      );
    } else {
      res.send(
        //@ts-expect-error token undefined
        `<script>window.opener.postMessage('${JSON.stringify({ error })}', 'http://localhost:3000')</script>`,
      );
    }
  }

  @Post('/login')
  async login(
    @Body()
    loginDto: LoginRequestDto,
  ) {
    console.log('loginnn');
    const { email, password } = loginDto;
    const existingUser = await this.authService.getUser(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (!existingUser.password) {
      throw new BadRequestException('Not authenticated with credentials');
    }

    const passwordVerified = await this.authService.verifyUser(email, password);
    if (!passwordVerified) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const token = await this.authService.generateJWT({
      id: existingUser.id,
      email: existingUser.email,
    });
    delete existingUser.password;
    return { user: existingUser, token };
  }

  @Post('/otp')
  async sendVerificationMail(@Body() { email }: { email: string }) {
    if (!email) {
      throw new BadRequestException();
    }
    const { otp, validity } = this.otpService.generateOtp(email);
    const res = await this.mailerService.sendVerificationCode(email, otp);
    if (!res) {
      throw new ServiceUnavailableException();
    }
    return { success: true, expiresIn: validity };
  }

  @Get('/otp/verify')
  async verifyOtp(@Query('otp') otp: string, @Query('email') email: string) {
    if (!otp || !email) {
      throw new BadRequestException();
    }
    console.log({ otp, email });
    const verified = this.otpService.checkValidity(email, otp);
    console.log({ verified });
    if (verified) {
      return { valid: true };
    } else {
      return { valid: false };
    }
  }
}
