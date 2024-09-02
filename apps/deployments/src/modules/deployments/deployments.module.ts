import { Module, forwardRef } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsRepository } from './deployments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DeploymentsUpdatesController } from './deployments-updates.controller';
import { AppModule } from 'src/app.module';
import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { Image, ImageSchema } from '../image/image.schema';
import { StaticSite, StaticSiteSchema } from 'src/schemas/staticSite.schema';
import { WebService, WebServiceSchema } from 'src/schemas/webService.schema';
import { Env, EnvSchema } from 'src/schemas/env.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Image.name, schema: ImageSchema },
      { name: StaticSite.name, schema: StaticSiteSchema },
      { name: WebService.name, schema: WebServiceSchema },
      { name: Env.name, schema: EnvSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  controllers: [DeploymentsController, DeploymentsUpdatesController],
  providers: [DeploymentsService, DeploymentsRepository],
})
export class DeploymentsModule {}
