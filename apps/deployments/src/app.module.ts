import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

const kafkaModule = ClientsModule.register([
  {
    name: 'kafka-service',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'deployments',
        brokers: ['localhost:19092'],
      },
      consumer: {
        groupId: 'deployments',
      },
    },
  },
]);

@Module({
  imports: [
    UsersModule,
    DeploymentsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/servel-depl'),
    kafkaModule,
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
