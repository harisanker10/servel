import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';

const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

async function bootstrap() {
  console.log({ kafkaUrl, kafkaPassword, kafkaUsername });
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaUrl],
        // sasl: {
        //   mechanism: 'plain',
        //   username: kafkaUsername,
        //   password: kafkaPassword,
        // },
      },
      consumer: {
        groupId: 'request-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
