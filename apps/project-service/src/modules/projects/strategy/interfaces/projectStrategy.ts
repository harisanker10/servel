import { ModuleRef } from '@nestjs/core';
import {
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentDeployingEventDto,
} from '@servel/common';
import {
  CreateProjectDto,
  GetProjectDto,
  ProjectType,
} from '@servel/proto/projects';
import { KubernetesService } from 'src/modules/kubernetes/kubernetes.service';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import { CreateDeploymentDto } from 'src/repository/interfaces/IDeployment.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { PopulatedProject, Project, Deployment } from 'src/types';
import { KafkaService } from '../../services/kafka.service';

export abstract class ProjectsStrategy {
  protected projectRepository: ProjectRepository;
  protected deploymentRepository: DeploymentRepository;
  protected kafkaService: KafkaService;
  protected clusterService: KubernetesService;
  constructor(protected readonly moduleRef: ModuleRef) {
    this.projectRepository = this.moduleRef.get(ProjectRepository);
    this.deploymentRepository = this.moduleRef.get(DeploymentRepository);
    this.kafkaService = this.moduleRef.get(KafkaService);
    this.clusterService = this.moduleRef.get(KubernetesService);
  }
  async createProject(dto: CreateProjectDto): Promise<PopulatedProject> {
    const project = await this.projectRepository.createProject({
      instanceType: dto.instanceType,
      name: dto.name,
      projectType: ProjectType.WEB_SERVICE,
      userId: dto.userId,
      envs: dto.env,
    });
    const deployment = await this.deploymentRepository.createDeployment({
      projectId: project.id,
      webServiceData: dto.webServiceData,
    });

    this.kafkaService.emitToBuildAndDeployQueue({
      projectId: project.id,
      projectType: project.projectType,
      envs: dto.env,
      name: project.name,
      instanceType: project.instanceType,
      webServiceData: project.projectType === ProjectType.WEB_SERVICE && {
        ...deployment.webServiceData,
        buildLogsPushUrl: '',
      },
      imageServiceData: project.projectType === ProjectType.IMAGE && {
        ...deployment.imageData,
      },
      staticSiteServiceData: project.projectType ===
        ProjectType.STATIC_SITE && {
        ...deployment.staticSiteData,
        assetsPushUrl: '',
        buildLogsPushUrl: '',
      },
      deploymentId: deployment.id,
    });

    return { ...project, deployments: [deployment] };
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const project = await this.projectRepository.getProject(projectId);
    const deployments =
      await this.deploymentRepository.findDeploymentsOfProject(projectId);
    return { ...project, deployments };
  }

  getAllProjects(userId: string): Promise<Project[]> {
    return this.projectRepository.getProjectsOfUser(userId);
  }

  abstract startProject(deploymentId: string): Promise<Project>;

  abstract stopProject(projectId: string): Promise<Project>;

  abstract rollbackProject(deploymentId: string): Promise<Deployment>;

  abstract redeployProject(data: CreateDeploymentDto): Promise<Project>;

  abstract updateInstanceType(
    projectId: string,
    instanceType: string,
  ): Promise<Project>;

  abstract deleteProject(request: GetProjectDto): Promise<Project>;

  abstract retryAndDeploy(deploymentId: string): Promise<Deployment>;

  abstract handleBuildingEvent(dto: DeploymentBuildingEventDto);

  abstract handleDeployingEvent(dto: DeploymentDeployingEventDto);

  abstract handleDeployedEvent(dto: DeploymentDeployedEventDto);

  abstract handleDeploymentFailure(dto: {
    projectId?: string;
    deploymentId: string;
    err: string;
  });
}
