import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
import { Env, EnvSchema } from 'src/schemas/env.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { ProjectRepository } from 'src/repository/project.repository';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { EnvService } from './services/env.service';
import { EnvController } from './controllers/env.controller';
import { DeploymentsUpdatesController } from './controllers/deployments-updates.controller';
import { EnvRepository } from 'src/repository/env.repository';
import { KafkaModule } from '../kafka/kafka.module';
import { Request, RequestSchema } from 'src/schemas/request.schema';
import { KubernetesService } from './services/kubernetes.service';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { WebService, WebServiceSchema } from 'src/schemas/webService.schema';
import { StaticSite, StaticSiteSchema } from 'src/schemas/staticsite.schema';
import { DeploymentRepository } from 'src/repository/deployment.repository';

@Module({
  imports: [
    forwardRef(() => AppModule),
    KafkaModule,
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Image.name, schema: ImageSchema },
      { name: WebService.name, schema: WebServiceSchema },
      { name: StaticSite.name, schema: StaticSiteSchema },
      { name: Env.name, schema: EnvSchema },
      { name: Request.name, schema: RequestSchema },
    ]),
  ],
  controllers: [
    ProjectsController,
    DeploymentsUpdatesController,
    EnvController,
  ],
  providers: [
    ProjectsService,
    KubernetesService,
    ProjectRepository,
    DeploymentRepository,
    EnvService,
    EnvRepository,
  ],
})
export class ProjectsModule {}
