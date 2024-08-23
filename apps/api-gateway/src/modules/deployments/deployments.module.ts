import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEPLOYMENTS_PACKAGE_NAME } from '@servel/dto';
import { join } from 'path';
import { DeploymentsController } from './deployments.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

const path = join(__dirname, '../../../proto/deployments.proto');
console.log({ path });

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'deployments',
        transport: Transport.GRPC,
        options: {
          protoPath: path,
          package: DEPLOYMENTS_PACKAGE_NAME,
          url: '0.0.0.0:50002',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [DeploymentsController],
  providers: [],
})
export class DeploymentsModule {}
