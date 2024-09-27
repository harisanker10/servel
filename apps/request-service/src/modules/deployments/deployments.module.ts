import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
    ]),
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsRepository],
  exports: [DeploymentsRepository],
})
export class DeploymentsModule {}
