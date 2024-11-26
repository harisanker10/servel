import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { Kafka } from '@nestjs/microservices/external/kafka.interface';
import {
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectStatus,
  ProjectType,
  StaticSiteUpdatesDto,
} from '@servel/common';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';

@Controller()
export class DeploymentsController {
  constructor(private readonly deploymentRepository: DeploymentsRepository) {}

  @EventPattern(KafkaTopics.clusterUpdates)
  async updateWebService(data: ClusterUpdatesDto) {
    console.log('Got new deployement data', { data });
    if (data.type === ProjectType.WEB_SERVICE) {
      const existing = await this.deploymentRepository.getDeployment(
        data.deploymentId,
      );
      if (!existing?.id) {
        await this.deploymentRepository.createDeployment({
          deploymentId: data.deploymentId,
          port: data.data.port,
          clusterServiceName: data.data.k8ServiceId,
          clusterContainerName: data.data.k8ServiceId,
          clusterDeploymentName: data.data.k8DeploymentId,
        });
      } else {
        this.deploymentRepository.updateDeployment(data.deploymentId, {
          port: data.data.port,
          clusterServiceName: data.data.k8ServiceId,
          clusterContainerName: data.data.k8ServiceId,
          clusterDeploymentName: data.data.k8DeploymentId,
        });
      }
    } else if (data.type === ProjectType.STATIC_SITE) {
      // await this.deploymentRepository.createDeployment({
      //   deploymentId: data.deploymentId,
      //   s3Path: data.data.s3Path,
      // });
    }
  }

  @EventPattern(KafkaTopics.staticSiteUpdates)
  async updateStaticSite(data: StaticSiteUpdatesDto) {
    const existing = await this.deploymentRepository.getDeployment(
      data.deploymentId,
    );
    if (existing?.id && 'status' in data) {
      this.deploymentRepository.updateDeployment(data.deploymentId, {
        status: data.status,
      });
    } else {
      await this.deploymentRepository.createDeployment({
        deploymentId: data.deploymentId,
        s3Path: data.s3Path,
      });
    }
  }
}
