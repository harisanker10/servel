import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
import { Env, EnvSchema } from 'src/schemas/env.schema';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { StaticSite, StaticSiteSchema } from 'src/schemas/staticsite.schema';
import { WebService, WebServiceSchema } from 'src/schemas/webService.schema';
import { ProjectRepository } from 'src/repository/project.repository';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { EnvService } from './services/env.service';
import { EnvController } from './controllers/env.controller';
import { DeploymentsUpdatesController } from './controllers/deployments-updates.controller';
import { EnvRepository } from 'src/repository/env.repository';
import { KafkaModule } from '../kafka/kafka.module';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    KafkaModule,
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Env.name, schema: EnvSchema },
    ]),
  ],
  controllers: [
    ProjectsController,
    DeploymentsUpdatesController,
    EnvController,
  ],
  providers: [ProjectsService, ProjectRepository, EnvService, EnvRepository],
})
export class ProjectsModule {}
