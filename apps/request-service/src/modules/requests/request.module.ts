import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
import { RequestController } from './request.controller';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';
import { S3 } from './s3.service';

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
    ConfigModule,
  ],
  controllers: [RequestController],
  providers: [
    DeploymentsRepository,
    {
      provide: S3,
      useFactory: (configService: ConfigService) => {
        const bucket = configService.getOrThrow('S3_BUCKET');
        return new S3(bucket, configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class RequestModule {}
