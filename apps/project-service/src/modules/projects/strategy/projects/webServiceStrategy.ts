import { Deployment, PopulatedProject, Project } from 'src/types';
import { ProjectsStrategy } from '../interfaces/projectStrategy';
import { CreateProjectDto, GetProjectDto } from '@servel/proto/projects';
import { ProjectRepository } from 'src/repository/project.repository';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import {
  DeploymentStatus,
  ProjectStatus,
  ProjectType,
} from '@servel/common/types';
import { KafkaService } from '../../services/kafka.service';
import { KubernetesService } from 'src/modules/kubernetes/kubernetes.service';
import { ModuleRef } from '@nestjs/core';
import {
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentDeployingEventDto,
  DeploymentQueueDto,
} from '@servel/common';
import { CreateDeploymentDto } from 'src/repository/interfaces/IDeployment.repository';
import { NotImplementedException } from '@nestjs/common';

export class WebServiceStrategy extends ProjectsStrategy {
  constructor(protected readonly moduleRef: ModuleRef) {
    super(moduleRef);
  }

  async stopProject(projectId: string): Promise<Project> {
    const deployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(projectId);
    const project = await this.projectRepository.updateProject({
      projectId,
      updates: {
        status: ProjectStatus.STOPPED,
        deploymentUrl: null,
      },
    });
    if (deployment) {
      await this.deploymentRepository.updateDeploymentStatus(
        deployment.id,
        DeploymentStatus.STOPPED,
      );
      this.kafkaService.emitDeploymentStoppedEvent({
        projectId: project.id,
        deploymentId: deployment.id,
        projectType: ProjectType.WEB_SERVICE,
      });
      this.clusterService.stopDeployment(deployment.id);
    }
    return project;
  }

  async startProject(deploymentId: string): Promise<Project> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(
        deployment.projectId,
      );
    if (activeDeployment) {
      await this.stopProject(deployment.projectId);
    }
    const [project] = await Promise.all([
      this.projectRepository.updateProjectStatus(
        deployment.projectId,
        ProjectStatus.QUEUED,
      ),
      this.deploymentRepository.updateDeploymentStatus(
        deployment.id,
        DeploymentStatus.STARTING,
      ),
    ]);
    this.kafkaService.emitToDeploymentQueue({
      projectId: project.id,
      projectType: ProjectType.WEB_SERVICE,
      deploymentId: deployment.id,
      webServiceData: { ...deployment.webServiceData, buildLogsPushUrl: '' },
      instanceType: project.instanceType,
      name: project.name,
      envs: deployment.envs,
    });
    return project;
  }

  async rollbackProject(deploymentId: string): Promise<Deployment> {
    await this.startProject(deploymentId);
    return this.deploymentRepository.findDeploymentById(deploymentId);
  }

  async redeployProject(data: CreateDeploymentDto) {
    const deployment = await this.deploymentRepository.createDeployment(data);
    return this.startProject(deployment.id);
  }

  async retryAndDeploy(deploymentId: string): Promise<Deployment> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    await this.stopProject(deployment.projectId);
    await this.deploymentRepository.updateDeploymentData(deployment.id, {
      builtImage: null,
    });
    await this.startProject(deployment.id);
    return deployment;
  }

  async handleBuildingEvent(dto: DeploymentBuildingEventDto) {
    await Promise.all([
      this.deploymentRepository.updateDeployment({
        deploymentId: dto.deploymentId,
        updates: {
          status: DeploymentStatus.STARTING,
          buildLogBucketPath: dto.buildLogBucketPath,
        },
      }),
      this.projectRepository.updateProjectStatus(
        dto.projectId,
        ProjectStatus.BUILDING,
      ),
    ]);
  }

  async handleDeployingEvent(dto: DeploymentDeployingEventDto) {
    await Promise.all([
      this.projectRepository.updateProjectStatus(
        dto.projectId,
        ProjectStatus.DEPLOYING,
      ),
      this.deploymentRepository.updateDeploymentData(dto.deploymentId, {
        ...dto.webServiceData,
        builtImage: dto.webServiceData.clusterImageName,
      }),
      this.deploymentRepository.updateDeploymentStatus(
        dto.deploymentId,
        DeploymentStatus.ACTIVE,
      ),
    ]);
  }

  async handleDeployedEvent(dto: DeploymentDeployedEventDto) {
    const project = await this.projectRepository.getProject(dto.projectId);
    await Promise.all([
      this.deploymentRepository.updateDeploymentData(dto.deploymentId, {
        ...dto.webServiceData,
        builtImage: dto.webServiceData.clusterImageName,
      }),
      this.projectRepository.updateProject({
        projectId: dto.projectId,
        updates: {
          status: ProjectStatus.DEPLOYED,
          deploymentUrl: `http://${project.name}.servel.com`,
        },
      }),
      this.deploymentRepository.updateDeploymentStatus(
        dto.deploymentId,
        DeploymentStatus.ACTIVE,
      ),
    ]);
  }

  async handleDeploymentFailure(dto: {
    projectId?: string;
    deploymentId: string;
    err: string;
  }) {
    const deployment = await this.deploymentRepository.updateDeploymentStatus(
      dto.deploymentId,
      DeploymentStatus.STOPPED,
    );
    await Promise.all([
      this.projectRepository.updateProjectStatus(
        deployment.projectId,
        ProjectStatus.FAILED,
      ),
    ]);

    const project = await this.projectRepository.getProject(
      deployment.projectId,
    );
    this.kafkaService.emitDeploymentStoppedEvent({
      projectId: project.id,
      deploymentId: deployment.id,
      projectType: project.projectType,
    });
  }

  async handleDeploymentRunningState(deploymentId: string) {
    const deployment = await this.deploymentRepository.updateDeployment({
      deploymentId,
      updates: {
        status: DeploymentStatus.ACTIVE,
      },
    });
    await this.projectRepository.updateProjectStatus(
      deployment.projectId,
      ProjectStatus.DEPLOYED,
    );
  }

  updateInstanceType(
    projectId: string,
    instanceType: string,
  ): Promise<Project> {
    throw new NotImplementedException();
  }
  deleteProject(request: GetProjectDto): Promise<Project> {
    throw new NotImplementedException();
  }
}
