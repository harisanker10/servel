import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PROJECTS_PACKAGE_NAME } from '@servel/proto/projects';
import { ReflectionService } from '@grpc/reflection';
import 'dotenv/config';

const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

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
        brokers: [kafkaUrl],
        sasl: {
          mechanism: 'plain',
          username: kafkaUsername,
          password: kafkaPassword,
        },
      },
      consumer: {
        groupId: 'projects-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(9846);
}
bootstrap();
