import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { Deployment, deploymentSchema } from 'src/schemas/deployment.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { ProjectRepository } from 'src/repository/project.repository';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { DeploymentsUpdatesController } from './controllers/deployments-updates.controller';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { WebService, WebServiceSchema } from 'src/schemas/webService.schema';
import { StaticSite, StaticSiteSchema } from 'src/schemas/staticsite.schema';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import { DeploymentService } from './services/deployments.service';
import { AnalyticsService } from './services/analytics.service';
import { Analytics, AnalyticsSchema } from 'src/schemas/analytics.schema';
import { DeploymentsController } from './controllers/deployments.controller';
import { S3Service } from './services/s3.service';
import { KubernetesService } from 'src/modules/kubernetes/kubernetes.service';
import { KafkaService } from './services/kafka.service';
import { KubernetesModule } from '../kubernetes/kubernetes.module';
import { AnalyticsRepository } from 'src/repository/analytics.repository';
import { ProjectStrategyResolver } from './strategy/resolver/projectStrategyResolver';

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => KubernetesModule),
    MongooseModule.forFeature([
      { name: Deployment.name, schema: deploymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Image.name, schema: ImageSchema },
      { name: WebService.name, schema: WebServiceSchema },
      { name: StaticSite.name, schema: StaticSiteSchema },
      { name: Analytics.name, schema: AnalyticsSchema },
    ]),
  ],
  controllers: [
    ProjectsController,
    DeploymentsController,
    DeploymentsUpdatesController,
  ],
  exports: [
    ProjectsService,
    DeploymentRepository,
    ProjectRepository,
    ProjectStrategyResolver,
  ],
  providers: [
    ProjectRepository,
    DeploymentRepository,
    AnalyticsRepository,
    ProjectStrategyResolver,
    ProjectsService,
    DeploymentService,
    AnalyticsService,
    S3Service,
    KafkaService,
    KubernetesService,
  ],
})
export class ProjectsModule {}
