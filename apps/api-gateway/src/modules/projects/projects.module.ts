import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import {
  PROJECTS_PACKAGE_NAME,
  PROJECTS_SERVICE_NAME,
} from '@servel/proto/projects';
import { ProjectsController } from './projects.controller';

const path = join(__dirname, '../../../proto/projects.proto');
console.log({ path });

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PROJECTS_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          protoPath: path,
          package: PROJECTS_PACKAGE_NAME,
          url: '0.0.0.0:50002',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [ProjectsController],
  providers: [],
})
export class ProjectsModule {}
