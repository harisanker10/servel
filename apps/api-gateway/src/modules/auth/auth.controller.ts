import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
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
import { Request, Response } from 'express';
import { MailerService } from 'src/mailer.service';
import { UserControllerErrorHandlingInterceptor } from './filters/userControllerExceptionHandler';
import { OtpService } from 'src/utils/otp.service';
import {
  LoginRequestDto,
  ResetPasswordDto,
  SignupRequestDto,
  SignupResponseDto,
} from '@servel/common/api-gateway-dto';
import {
  resetPasswordSchema,
  signupAuthSchema,
} from '@servel/common/zodSchemas';
import { AuthType, AuthType as RPCAuthType, User } from '@servel/proto/users';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { OtpGuard } from './guards/otp.guard';
import { ZodPipe } from '../../pipes/zodValidation.pipe';
import { GithubAuthGuard } from './guards/githubAuth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JWTGuard } from './guards/jwt.guard';

@UseInterceptors(UserControllerErrorHandlingInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private mailerService: MailerService,
    private otpService: OtpService,
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/')
  @UseGuards(JWTGuard)
  getUser(@Req() req: Request & { user: { email: string } }) {
    return req.user;
  }

  @Post('/signup')
  @UsePipes(new ZodPipe(signupAuthSchema))
  @UseGuards(OtpGuard)
  async signup(
    @Body()
    signupDto: SignupRequestDto,
  ): Promise<SignupResponseDto> {
    const { email, password } = signupDto;
    const newUser = await this.userService.createUserWithEmail({
      email,
      password,
    });
    const token = await this.authService.generateJWT({
      id: newUser.id,
      email: newUser.email,
    });
    return { token, user: newUser };
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubLogin() {
    // Initiates the GitHub login flow
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let error: string | undefined;
    let token: string | undefined;
    console.log('userrrrrrrrrrrr', req.user);
    // @ts-ignore
    const { fullname, githubId, avatar, email, accessToken, refreshToken } =
      req?.user;
    console.log({ state });
    let user: User | null = null;
    if (state === 'signup') {
      user = await this.userService.getUser(email);
      if (user) {
        error = 'User already exist. Try login';
      } else {
        user = await this.userService.createUserWithOAuth({
          email,
          avatar,
          authType: AuthType.GITHUB,
          accessToken,
          refreshToken,
          githubId,
        });
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    } else if (state === 'login') {
      user = await this.userService.getUser(email);
      if (!user) {
        error = 'User not found';
      }
      if (user && !user?.authType?.includes(AuthType.GITHUB)) {
        error = 'Not authenticated with Github';
      }
      if (user) {
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    }

    if (error) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ error })}', 'http://localhost:3000');window.close();</script>`,
      );
    }
    if (user && token) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ user, token })}', 'http://localhost:3000/projects');window.close()</script>`,
      );
    }
  }

  @Patch('/password')
  @UsePipes(new ZodPipe(resetPasswordSchema))
  @UseGuards(OtpGuard)
  async updatePassword(@Body() body: ResetPasswordDto) {
    console.log('patching password', body);
    this.userService.resetPassword(body.email, body.password);
  }

  @Get('/exist/:email')
  async chechUserExist(@Param('email') email: string) {
    console.log({ email });
    const user = await this.userService.getUser(email);
    console.log({ user });
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
    const {
      email,
      picture: avatar,
      name: fullname,
      accessToken,
      refreshToken,
    } = req.user;
    console.log({ accessToken, refreshToken });
    if (state === 'signup') {
      user = await this.userService.getUser(email);
      if (user) {
        error = 'User already exist. Try login';
      } else {
        user = await this.userService.createUserWithOAuth({
          email,
          avatar,
          authType: AuthType.GOOGLE,
          fullname,
          accessToken,
          refreshToken,
        });
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    } else if (state === 'login') {
      user = await this.userService.getUser(email);
      if (!user) {
        error = 'User not found';
      }
      if (user && !user?.authType?.includes(AuthType.GOOGLE)) {
        error = 'Not authenticated with google';
      }
      if (user) {
        token = await this.authService.generateJWT({ email, id: user.id });
      }
    }

    //@ts-expect-error token undefined
    if (error) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ error })}', 'http://localhost:3000')</script>`,
      );
    }
    //@ts-expect-error token undefined
    if (user && token) {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ user, token })}', 'http://localhost:3000/projects')</script>`,
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
    const existingUser = await this.userService.getUser(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (
      !existingUser.password ||
      !existingUser.authType.includes(AuthType.CREDENTIALS)
    ) {
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
