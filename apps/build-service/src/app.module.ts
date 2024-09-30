import { Module } from '@nestjs/common';
import { BuildModule } from './modules/build/build.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from './modules/kafka/kafka.module';
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
        clientId: 'build',
        brokers: [kafkaUrl],
        sasl: {
          mechanism: 'plain',
          username: kafkaUsername,
          password: kafkaPassword,
        },
      },
      consumer: {
        groupId: 'build-consumer',
      },
    },
  },
]);

@Module({
  imports: [kafkaModule, BuildModule, KafkaModule],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
