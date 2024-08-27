import { Inject, Injectable } from '@nestjs/common';
import { DeploymentsRepository } from './deployments.repository';
import {
  CreateWebServiceDto,
  Deployment,
  DeploymentStatus,
  InstanceType,
} from '@servel/dto';
import { getReponame } from 'src/utils/getReponame';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class DeploymentsService {
  constructor(
    private readonly deplRepository: DeploymentsRepository,
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {}

  createWebService(depl: CreateWebServiceDto) {
    const {
      url: repoUrl,
      instanceType,
      outDir,
      userId,
      runCommand,
      buildCommand,
    } = depl;
    const deployment = {
      repoUrl,
      userId,
      type: 'web-service',
      status: DeploymentStatus.queued,
      buildCommand: buildCommand || 'npm run build',
      runCommand: runCommand || 'npm run start',
      repoName: getReponame(repoUrl),
      outDir: outDir || './dist',
      deploymentUrl: '',
      instanceType: InstanceType[instanceType],
      githubAccessToken: '',
    };
    return this.deplRepository.createWebService({
      ...deployment,
      port: 3000,
      version: 1,
    });
  }

  updateDeployment(
    deplId: string,
    version: number,
    updates: { status?: DeploymentStatus; image?: string },
  ) {
    return this.deplRepository.updateDeployment(deplId, version, updates);
  }

  updateDeplUrl(deplId: string, url: string) {
    return this.deplRepository.updateDeplUrl(deplId, url);
  }

  getUsersDeployments(userId: string) {
    return this.deplRepository.getDeploymentsByUserId(userId);
  }

  getDeployment(deplId: string): Promise<Deployment> {
    return this.deplRepository.getDeployment(deplId);
  }
}
