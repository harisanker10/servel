import { Injectable, Logger } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { InstanceType } from '@servel/common/types';
import { ManifestService } from './manifest.service';

@Injectable()
export class KubernetesService {
  private readonly kubeConfig: k8s.KubeConfig;
  private readonly appsApi: k8s.AppsV1Api;
  private readonly coreApi: k8s.CoreV1Api;
  private readonly logger: Logger;

  constructor(private readonly manifestService: ManifestService) {
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    this.coreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.logger = new Logger(KubernetesService.name);
  }

  async createDeployment({
    deploymentName,
    port,
    imageName,
    envs,
    instanceType = InstanceType.TIER_0,
    namespace = 'default',
  }: {
    deploymentName: string;
    imageName: string;
    port: number;
    envs?: { name: string; value: string }[];
    instanceType: InstanceType;
    namespace: string;
  }): Promise<k8s.V1Deployment> {
    try {
      const manifest = this.manifestService.createDeploymentManifest({
        namespace,
        port,
        instanceType,
        envs,
        imageName,
        deploymentName,
      });
      console.log({ manifest });
      await this.appsApi
        .deleteNamespacedDeployment(deploymentName, namespace)
        .catch((err) => {});
      await this.coreApi
        .deleteNamespacedService(deploymentName, namespace)
        .catch((err) => {});
      const response = await this.appsApi.createNamespacedDeployment(
        namespace,
        manifest,
      );
      return response.body;
    } catch (error) {
      throw new Error(
        `Failed to create deployment: ${error.response?.body?.message || error.message}`,
      );
    }
  }

  async createPod({
    podName,
    port,
    imageName,
    envs,
    instanceType = InstanceType.TIER_0,
    namespace = 'default',
  }: {
    podName: string;
    imageName: string;
    port: number;
    envs?: { name: string; value: string }[];
    instanceType: InstanceType;
    namespace: string;
  }) {
    const manifest = this.manifestService.createPodManifest({
      namespace,
      port,
      instanceType,
      envs,
      imageName,
      podName,
    });

    await this.coreApi.createNamespacedPod(namespace, manifest);
  }

  async createService({
    namespace = 'default',
    serviceName,
    port,
    deploymentName,
  }: {
    deploymentName: string;
    port: number;
    namespace: string;
    serviceName: string;
  }) {
    const serviceManifest = this.manifestService.createServiceManifest({
      deploymentName,
      port,
      serviceName,
    });
    await this.coreApi.createNamespacedService(namespace, serviceManifest);
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

  checkDeploymentReadiness({
    deploymentName,
    namespace = 'default',
    maxWaitTimeInSeconds = 180,
  }: {
    deploymentName: string;
    namespace: string;
    maxWaitTimeInSeconds: number;
  }) {
    let checks = 0;
    return new Promise((res, rej) => {
      const interval = setInterval(() => {
        this.appsApi
          .readNamespacedDeployment(deploymentName, namespace)
          .then((depl) => {
            if (depl.body.status.readyReplicas) {
              console.log(`Pod ${deploymentName} is ready`);
              clearInterval(interval);
              res(true);
            }
            if (++checks >= maxWaitTimeInSeconds) {
              console.log(
                `Pod ${deploymentName} is not ready after maxWaitTime:`,
                maxWaitTimeInSeconds,
              );
              clearInterval(interval);
              rej(false);
            }
          })
          .catch((err) => {
            console.log(err.body);
            if (err === false) {
              throw err;
            }
          });
      }, 1000);
    });
  }
}
