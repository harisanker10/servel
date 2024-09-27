import { Module } from '@nestjs/common';
import { BuildService } from './build.service';
import { BuildController } from './build.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'build-service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'build',
            brokers: ['localhost:19092'],
          },
          consumer: {
            groupId: 'build-consumer',
          },
        },
      },
    ]),
    KafkaModule,
  ],
  controllers: [BuildController],
  providers: [BuildService],
})
export class BuildModule {}
