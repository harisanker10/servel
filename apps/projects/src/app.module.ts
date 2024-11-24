import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectsModule } from './modules/projects/projects.module';
import 'dotenv/config';

const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

const dbUrl = process.env.DB_URL;

const kafkaModule = ClientsModule.register([
  {
    name: 'kafka-service',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'projects',
        brokers: [kafkaUrl],
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
    MongooseModule.forRoot(dbUrl, { dbName: 'servel' }),
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
