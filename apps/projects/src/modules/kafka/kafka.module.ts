import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import 'dotenv/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'projects-service',
            brokers: [process.env.KAFKA_URL],
            // sasl: {
            //   mechanism: 'plain',
            //   username: process.env.KAFKA_USERNAME,
            //   password: process.env.KAFKA_PASSWORD,
            // },
          },
          consumer: {
            groupId: 'projects-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
