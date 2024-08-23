import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const protoPath = join(__dirname, './users.proto');
console.log({ protoPath });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath,
      package: 'users',
      url: '0.0.0.0:50001',
    },
  });
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['localhost:19092'],
  //     },
  //     consumer: {
  //       groupId: 'users-consumer',
  //     },
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(3300);
}
bootstrap();
