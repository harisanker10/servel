import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectsModule } from './modules/projects/projects.module';

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
    ProjectsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/servel-depl'),
    kafkaModule,
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
