import { Inject, Injectable } from '@nestjs/common';
import { DeploymentType } from '@servel/dto';
import { ClientKafka } from '@nestjs/microservices';
import { CreateDeploymentDto } from '@servel/dto/dist/proto';
import { DeploymentsRepository } from 'src/repository/deployments.repository';

@Injectable()
export class DeploymentsService {
  constructor(
    private readonly deplRepository: DeploymentsRepository,
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {}

  async createNewProjectDeployment(data: CreateDeploymentDto) {
    const project = await this.deplRepository.createProject({
      userId: data.userId,
      type: data.deploymentType,
      instanceType: data.instanceType,
    });
    if (
      data.deploymentType === DeploymentType.staticSite &&
      'staticSiteData' in data
    ) {
      const staticSite = await this.deplRepository.createStaticSiteDeployment({
        staticSiteData: data.staticSiteData,
        env: data.env,
        projectId: project.id,
      });
    } else if (data.deploymentType === DeploymentType.webService) {
      const webService = await this.deplRepository.createWebServiceDeployment({
        projectId: project.id,
        webServiceData: data.webServiceData,
        env: data.env,
      });
    } else if (data.deploymentType === DeploymentType.dockerImage) {
      const image = await this.deplRepository.createImageDeployment({
        env: data.env,
        projectId: project.id,
        imageData: data.imageData,
      });
    }
    return { projectId: project.id };
  }

  async getProjects(userId: string) {
    return this.deplRepository.getProjects(userId);
  }

  async getDeployments(projectId: string) {
    return this.deplRepository.getDeploymentsOfProject(projectId);
  }

  // updateDeployment(
  //   deplId: string,
  //   version: number,
  //   updates: { status?: DeploymentStatus; image?: string },
  // ) {
  //   return this.deplRepository.updateDeployment(deplId, version, updates);
  // }
  //
  // updateDeplUrl(deplId: string, url: string) {
  //   return this.deplRepository.updateDeplUrl(deplId, url);
  // }
  //
  // getUsersDeployments(userId: string) {
  //   return this.deplRepository.getDeploymentsByUserId(userId);
  // }
  //
  // getDeployment(deplId: string): Promise<Deployment> {
  //   return this.deplRepository.getDeployment(deplId);
  // }
}
