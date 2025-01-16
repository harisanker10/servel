import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { ProjectRepository } from 'src/repository/project.repository';
import { DeploymentRepository } from 'src/repository/deployment.repository';

@Injectable()
export class KubernetesService {
  private readonly kubeConfig: k8s.KubeConfig;
  private readonly appsApi: k8s.AppsV1Api;
  private readonly coreApi: k8s.CoreV1Api;

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly deploymentRepository: DeploymentRepository,
  ) {
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    this.coreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
  }

  async stopDeployment(deploymentId: string) {
    const deployment =
      await this.deploymentRepository.findDeploymentById(deploymentId);
    const clusterDeploymentName =
      deployment?.webServiceData?.clusterDeploymentName ||
      deployment?.imageData?.clusterDeploymentName;
    const clusterServiceName =
      deployment?.webServiceData?.clusterServiceName ||
      deployment?.imageData?.clusterServiceName;
    if (!clusterDeploymentName || !clusterServiceName) {
      throw new Error('No clusterServiceName or clusterDeploymentName present');
    }
    await Promise.all([
      this.deleteClusterIPService('deployments', clusterServiceName),
      this.deleteDeployment('deployments', clusterDeploymentName),
    ]);
  }

  private async createDeployment(
    namespace: string,
    deploymentManifest: k8s.V1Deployment,
  ): Promise<k8s.V1Deployment> {
    try {
      const response = await this.appsApi.createNamespacedDeployment(
        namespace,
        deploymentManifest,
      );
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to create deployment: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  private async getDeployments(
    namespace: string,
  ): Promise<k8s.V1DeploymentList> {
    try {
      const response = await this.appsApi.listNamespacedDeployment(namespace);
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to list deployments: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  private async updateDeployment(
    namespace: string,
    name: string,
    updatedManifest: k8s.V1Deployment,
  ): Promise<k8s.V1Deployment> {
    try {
      const response = await this.appsApi.replaceNamespacedDeployment(
        name,
        namespace,
        updatedManifest,
      );
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to update deployment: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  private async deleteDeployment(namespace: string, name: string) {
    try {
      return this.appsApi.deleteNamespacedDeployment(name, namespace);
    } catch (error) {
      throw new Error(
        `Failed to delete deployment: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  private async deleteClusterIPService(
    namespace: string,
    name: string,
  ): Promise<void> {
    try {
      await this.coreApi.deleteNamespacedService(name, namespace);
    } catch (error) {
      throw new Error(
        `Failed to delete ClusterIP service: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  private async getDeploymentLogs(
    namespace: string,
    podName: string,
    containerName?: string,
  ): Promise<string> {
    try {
      const response = await this.coreApi.readNamespacedPodLog(
        podName,
        namespace,
        containerName,
      );
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to fetch logs: ${error.response?.body?.message || error.message}`,
      );
    }
  }
}
