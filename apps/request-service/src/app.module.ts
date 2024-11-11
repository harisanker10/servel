import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { RequestModule } from './modules/requests/request.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

console.log({ elonma: process.env.DB_URL });
const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

const kafkaModule = ClientsModule.register([
  {
    name: 'kafka-service',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'request-service',
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
  },
]);

@Module({
  imports: [
    kafkaModule,
    ConfigModule.forRoot(),
    RequestModule,
    MongooseModule.forRoot(process.env.DB_URL),
    DeploymentsModule,
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
