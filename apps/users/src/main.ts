import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USERS_PACKAGE_NAME } from '@servel/proto/users';
import { ENV } from './config/env';
import { ReflectionService } from '@grpc/reflection';

const protoPath = join(__dirname, '../proto/users.proto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath,
      package: USERS_PACKAGE_NAME,
      url: ENV.GRPC_URL,
      onLoadPackageDefinition(pkg, server) {
        new ReflectionService(pkg).addToServer(server);
      },
      loader: {
        enums: String,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [ENV.KAFKA_URL],
        retry: {
          restartOnFailure: () => {
            return Promise.resolve(true);
          },
        },
      },
      consumer: {
        retry: {
          restartOnFailure: () => {
            return Promise.resolve(true);
          },
        },
        groupId: 'users-consumer',
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
