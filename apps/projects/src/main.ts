import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PROJECTS_PACKAGE_NAME } from '@servel/proto/projects';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
  console.log('statrt\n');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../proto/projects.proto'),
      package: PROJECTS_PACKAGE_NAME,
      url: '0.0.0.0:50002',
      onLoadPackageDefinition(pkg, server) {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:19092'],
      },
      consumer: {
        groupId: 'deployments-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(9846);
}
bootstrap();
