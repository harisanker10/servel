import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  console.log('statrt\n');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../proto/deployments.proto'),
      package: 'deployments',
      url: '0.0.0.0:50002',
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
