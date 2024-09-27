import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:19092'],
      },
      consumer: {
        groupId: 'build-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3010);
}
bootstrap();
