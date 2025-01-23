import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';

const kafkaUrl = process.env.KAFKA_URL;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'build',
        brokers: [kafkaUrl],
        // sasl: {
        //   mechanism: 'plain',
        //   username: kafkaUsername,
        //   password: kafkaPassword,
        // },
      },
      consumer: {
        groupId: 'build-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(2999);
}
bootstrap();
