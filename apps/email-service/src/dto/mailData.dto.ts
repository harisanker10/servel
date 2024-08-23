import { IsEmail, IsNotEmpty } from 'class-validator';

export class MailDataDto {
  @IsEmail()
  from: string;
  @IsEmail()
  to: string;
  @IsNotEmpty()
  subject: string;
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  html: string;
}
