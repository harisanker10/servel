import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from './users.service';
import { MailerService } from 'src/mailer.service';
import { USER_SERVICE_NAME } from '@servel/proto/users';
import { UserController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { OtpGuard } from '../auth/guards/otp.guard';
import { RepositoriesController } from './repositories.controller';

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
          loader: {
            enums: String,
          },
        },
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, RepositoriesController],
  providers: [MailerService, OtpGuard, UserService],
  exports: [UserService],
})
export class UsersModule {}
