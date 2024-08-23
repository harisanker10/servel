import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MailDataDto } from './dto/mailData.dto';
import { MailerService } from './nodemailer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailerService,
  ) {}

  // @Post('/send')
  // @UsePipes(ValidationPipe)
  // sendEmail(@Body() data: MailDataDto) {
  //   return this.mailService.send(data);
  // }

  @Post('/otp')
  sendOtpEmail(@Body() data: any) {
    if (!data.email || !data.otp) throw new BadRequestException();
    return this.mailService.sendOtpEmail(data.email, data.otp);
  }

  // @Post('/signup-welcome')
  // sendSignUpWelcome(@Body() data) {
  //   return this.mailService.sendSignupWelcome(data);
  // }
}
