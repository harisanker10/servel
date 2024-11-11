import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MailerService } from 'src/mailer.service';
import { OtpService } from 'src/utils/otp.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { env } from 'src/config/env';
import { GithubStrategy } from './strategies/github.strategy';
import { UsersModule } from '../users/users.module';
import { OtpGuard } from './guards/otp.guard';
import { JWTGuard } from './guards/jwt.guard';

const path = join(__dirname, '../../../proto/users.proto');
@Module({
  imports: [
    UsersModule,
    ClientsModule.register([
      {
        name: 'users',
        transport: Transport.GRPC,
        options: {
          protoPath: path,
          package: 'users',
          url: '0.0.0.0:50001',
        },
      },
    ]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    MailerService,
    OtpService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    GoogleStrategy,
    GithubStrategy,
    OtpGuard,
    JWTGuard,
  ],
  exports: [AuthService, OtpGuard, JWTGuard],
})
export class AuthModule {}
