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
import { KafkaService } from './kafka.service';
import { DeploymentStatus, ProjectStatus } from '@servel/common/types';
import { Deployment } from 'src/types';
import { KubernetesService } from 'src/modules/kubernetes/kubernetes.service';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly deploymentRepository: DeploymentRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly s3Service: S3Service,
    private readonly kubernetesService: KubernetesService,
  ) {}
  async createDeploymentForProject(data: CreateDeploymentDto) {
    const deployment = await this.deploymentRepository.createDeployment(data);
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

  async findActiveDeploymentOfProject(projectId: string) {
    return this.deploymentRepository.findActiveDeploymentOfProject(projectId);
  }

  async startDeployment(deploymentId: string): Promise<Deployment> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(
        deployment.projectId,
      );
    const [startedDeployment] = await Promise.allSettled([
      this.deploymentRepository.updateDeploymentStatus(
        deploymentId,
        DeploymentStatus.STARTING,
      ),
      activeDeployment?.id &&
        this.deploymentRepository.updateDeploymentStatus(
          activeDeployment.id,
          DeploymentStatus.STOPPED,
        ),
    ]);
    return startedDeployment.status === 'fulfilled' && startedDeployment.value;
  }

  async stopDeployment(deploymentId: string) {
    const deployment = await this.deploymentRepository.updateDeployment({
      deploymentId,
      updates: { status: DeploymentStatus.STOPPED },
    });
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
    await this.projectRepository.updateProjectStatus(
      deployment.projectId,
      ProjectStatus.QUEUED,
    );
    return deployment;
  }

  async getLogs(deploymentId: string): Promise<DeploymentLogs> {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    const project = await this.projectRepository.getProject(
      deployment.projectId,
    );
    if (!deployment.buildLogBucketPath) {
      throw new Error('No build logs bucket pathc');
    }
    const logs: DeploymentLogs = {};

    //TODO: move these logic and better string formatting and add timestamps possibly in the log upstream from build-service
    const deploymentBuildLog = await this.s3Service
      .getFileContent(deployment.buildLogBucketPath)
      .then((data) => {
        if (typeof data !== 'string') return;
        return data
          .split('\n')
          .filter((line) => line.includes('#9'))
          .map((line) => line.split(' ').slice(2).join(' '))
          .join('\n');
      });

    if (deploymentBuildLog) logs['deploymentBuildLog'] = deploymentBuildLog;
    if (deployment?.webServiceData?.id || deployment?.imageData?.id) {
      const podName = `${project.name}-${deployment.id}`;
      const deploymentRunLog = await this.kubernetesService
        .getDeploymentLogs('deployments', podName)
        .catch((err) => console.log(err));
      if (deploymentRunLog) {
        logs.deploymentRunLog = deploymentRunLog;
      }
    }

    return logs;
  }
}
