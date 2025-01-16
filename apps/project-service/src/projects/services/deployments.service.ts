import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@servel/common';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import { CreateDeploymentDto } from 'src/repository/interfaces/IDeployment.repository';
import {
  WebService,
  StaticSite,
  Image,
} from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { DeploymentLogs } from '@servel/proto/projects';
import { S3Service } from './s3.service';
import { KubernetesService } from './kubernetes.service';
import { KafkaService } from './kafka.service';
import { DeploymentStatus, ProjectStatus } from '@servel/common/types';
import { Deployment } from 'src/types';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly deploymentRepository: DeploymentRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly kafkaService: KafkaService,
    private readonly s3service: S3Service,
    private readonly kubernetesService: KubernetesService,
  ) {}
  async createDeploymentForProject(data: CreateDeploymentDto) {
    const deployment = await this.deploymentRepository.createDeployment(data);
    const project = await this.projectRepository.getProject(
      deployment.projectId,
    );
    await this.stopCurrentDeploymentOfProject(deployment.projectId);
    this.kafkaService.emitToBuildAndDeployQueue({
      instanceType: project.instanceType,
      deploymentId: deployment.id,
      name: project.name,
      projectId: project.id,
      envs: deployment.envs,
      imageServiceData: deployment.imageData,
      staticSiteServiceData: {
        ...deployment.staticSiteData,
        assetsPushUrl: '',
        buildLogsPushUrl: '',
      },
      webServiceData: { ...deployment.webServiceData, buildLogsPushUrl: '' },
      projectType: project.projectType,
    });
    return deployment;
  }

  async findDeployment(deploymentId: string) {
    const depl =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    if (!depl || !depl?.id) {
      throw new NotFoundException('Deployment not found');
    }
    return depl;
  }

  async findDeploymentsOfProject(projectId: string) {
    return this.deploymentRepository.findDeploymentsOfProject(projectId);
  }

  async updateDeployment(
    deplId: string,
    updates: Partial<Record<keyof Deployment, string>>,
  ) {
    return this.deploymentRepository.updateDeployment({
      deploymentId: deplId,
      updates,
    });
  }

  async updateDeploymentData(
    deplId: string,
    updates: Partial<
      Record<keyof WebService | keyof StaticSite | keyof Image, any>
    >,
  ) {
    return this.deploymentRepository.updateDeploymentData(deplId, updates);
  }

  async startDeployment(deploymentId: string): Promise<Deployment> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);

    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(
        deployment.projectId,
      );
    if (activeDeployment) {
      await this.stopDeployment(activeDeployment.id);
    }
    const [_, project] = await Promise.all([
      this.deploymentRepository.updateDeploymentStatus(
        deploymentId,
        DeploymentStatus.STARTING,
      ),
      this.projectRepository.updateProjectStatus(
        deployment.projectId,
        ProjectStatus.QUEUED,
      ),
      this.projectRepository.getProject(deployment.projectId),
    ]);

    // if webservice or image, if they were already built send deployment to emitToBuildAndDeployQueue else send to emitTodeploymentQueue

    const builtImage =
      deployment?.webServiceData?.builtImage || deployment?.imageData?.imageUrl;

    return { ...deployment, status: DeploymentStatus.STARTING };
  }

  async stopDeployment(deploymentId: string) {
    const deployment = await this.deploymentRepository.updateDeployment({
      deploymentId,
      updates: { status: DeploymentStatus.STOPPED },
    });

    const project = await this.projectRepository.getProject(
      deployment.projectId,
    );
    this.kafkaService.emitDeploymentStoppedEvent({
      deploymentId: deployment.id,
      projectId: deployment.projectId,
      projectType: project.projectType,
    });
    if (deployment?.webServiceData || deployment?.imageData) {
      await this.kubernetesService.stopDeployment(deploymentId);
    }
    return deployment;
  }

  async stopCurrentDeploymentOfProject(projectId: string) {
    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(projectId);
    if (!activeDeployment) {
      console.error('No active deployment found');
      return;
    }
    await this.deploymentRepository.updateDeploymentStatus(
      activeDeployment.id,
      DeploymentStatus.STOPPED,
    );
    const project = await this.projectRepository.getProject(
      activeDeployment.id,
    );
    this.kafkaService.emitDeploymentStoppedEvent({
      deploymentId: activeDeployment.id,
      projectId: projectId,
      projectType: project.projectType,
    });
    if (activeDeployment?.webServiceData || activeDeployment.imageData) {
      await this.kubernetesService.stopDeployment(activeDeployment.id);
    }
    return { ...activeDeployment, status: DeploymentStatus.STOPPED };
  }

  async switchActiveDeployment(deploymentId: string) {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(
        deployment.projectId,
      );
    await this.deploymentRepository.updateDeploymentStatus(
      activeDeployment.id,
      DeploymentStatus.ACTIVE,
    );
  }

  async retryDeployment(deploymentId: string) {
    const deployment = await this.stopDeployment(deploymentId);
    const project = await this.projectRepository.updateProjectStatus(
      deployment.projectId,
      ProjectStatus.QUEUED,
    );
    this.kafkaService.emitToBuildAndDeployQueue({
      instanceType: project.instanceType,
      deploymentId: deployment.id,
      name: project.name,
      projectId: project.id,
      envs: deployment.envs,
      imageServiceData: deployment.imageData,
      staticSiteServiceData: {
        ...deployment.staticSiteData,
        assetsPushUrl: '',
        buildLogsPushUrl: '',
      },
      webServiceData: { ...deployment.webServiceData, buildLogsPushUrl: '' },
      projectType: project.projectType,
    });
    return deployment;
  }

  async getLogs(deploymentId: string): Promise<DeploymentLogs> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    if (!deployment.buildLogBucketPath) {
      throw new Error('No build logs bucket pathc');
    }
    const logs = {
      deploymentBuildLog: await this.s3service.getFileContent(
        deployment.buildLogBucketPath,
      ),
    };
    console.log({ logs });
    return logs;
  }
}
