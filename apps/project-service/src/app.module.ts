import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { KubernetesModule } from './modules/kubernetes/kubernetes.module';

const kafkaUrl = process.env.KAFKA_URL;
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
    MongooseModule.forRoot(dbUrl, { dbName: 'servel' }),
    kafkaModule,
    ProjectsModule,
    KubernetesModule,
  ],
  controllers: [],
  providers: [],
  exports: [kafkaModule],
})
export class AppModule {}
