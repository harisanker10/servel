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

const path = join(__dirname, '../../../proto/users.proto');
console.log({ path });

@Module({
  imports: [
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
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: '15d',
      },
    }),
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
  ],
  exports: [AuthService],
})
export class AuthModule {}
