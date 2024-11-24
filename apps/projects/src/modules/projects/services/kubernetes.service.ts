import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubernetesService {
  private readonly kubeConfig: k8s.KubeConfig;
  private readonly appsApi: k8s.AppsV1Api;
  private readonly coreApi: k8s.CoreV1Api;

  constructor() {
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    this.coreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
  }

  async createDeployment(
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

  async getDeployments(namespace: string): Promise<k8s.V1DeploymentList> {
    try {
      const response = await this.appsApi.listNamespacedDeployment(namespace);
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to list deployments: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  async updateDeployment(
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

  async deleteDeployment(namespace: string, name: string) {
    try {
      return this.appsApi.deleteNamespacedDeployment(name, namespace);
    } catch (error) {
      throw new Error(
        `Failed to delete deployment: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  async deleteClusterIPService(namespace: string, name: string): Promise<void> {
    try {
      await this.coreApi.deleteNamespacedService(name, namespace);
    } catch (error) {
      throw new Error(
        `Failed to delete ClusterIP service: ${error.response?.body?.message || error.message}`,
      );
    }
  }
}
