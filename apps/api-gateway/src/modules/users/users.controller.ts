import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { UserService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { OtpGuard } from '../auth/guards/otp.guard';

@Controller('user')
@UseGuards(JWTGuard)
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getUser(@Req() req: Request) {
    const id = req.user?.id;
    const user = await this.userService.getUser(undefined, id);
    console.log({ user });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/')
  async updateUser(@Req() req: Request, @Body() body: any) {
    if ('fullname' in body) {
      return this.userService.updateFullname(req.user.id, body.fullname);
    }
  }

  @Patch('/email')
  @UseGuards(OtpGuard)
  async updateEmail(@Req() req: Request, @Body() body: any) {
    console.log({ body });
    const updatedUser = await this.userService.updateEmail({
      id: req.user.id,
      email: body.email,
    });
    return {
      token: this.authService.generateJWT({
        id: req.user.id,
        email: updatedUser.email,
      }),
    };
  }
}
