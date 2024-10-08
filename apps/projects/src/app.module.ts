import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectsModule } from './modules/projects/projects.module';
import 'dotenv/config';

const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

const kafkaModule = ClientsModule.register([
  {
    name: 'kafka-service',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'projects',
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
  },
]);

@Module({
  imports: [
    kafkaModule,
    ProjectsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/servel-depl'),
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
