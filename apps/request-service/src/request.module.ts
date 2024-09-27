import { Module } from '@nestjs/common';
import { RequestController } from './controllers/request.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DeploymentsRepository } from './repositories/deployment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchema } from './schemas/deployment.schema';

const kafkaUrl = process.env.KAFKA_URL;
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'build-service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'request-service',
            brokers: [kafkaUrl],
            sasl: {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword,
            },
          },
          consumer: {
            groupId: 'request-service-consumer',
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
    ]),
  ],
  controllers: [RequestController],
  providers: [DeploymentsRepository],
})
export class RequestModule {}
