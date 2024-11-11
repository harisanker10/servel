import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from './users.service';
import { MailerService } from 'src/mailer.service';
import { OtpService } from 'src/utils/otp.service';
import { USER_SERVICE_NAME } from '@servel/proto/users';
import { UserController } from './users.controller';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { OtpGuard } from '../auth/guards/otp.guard';

const protoPath = join(__dirname, '../../../proto/users.proto');
@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          protoPath: protoPath,
          package: 'users',
          url: '0.0.0.0:50001',
        },
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [MailerService, OtpGuard, UserService],
  exports: [UserService],
})
export class UsersModule {}
