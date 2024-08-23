import { Module, forwardRef } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsRepository } from './deployments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchema } from './deployments.schema';
import { DeploymentsUpdatesController } from './deployments-updates.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  controllers: [DeploymentsController, DeploymentsUpdatesController],
  providers: [DeploymentsService, DeploymentsRepository],
})
export class DeploymentsModule {}
