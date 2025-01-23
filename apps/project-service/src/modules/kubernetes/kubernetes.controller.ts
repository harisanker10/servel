import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { KubernetesService } from './kubernetes.service';
import { ProjectStrategyResolver } from '../projects/strategy/resolver/projectStrategyResolver';

/*
 * This controller watches cluster resource changes and updates database records
 */

@Controller()
export class KubernetesController implements OnModuleInit {
  private kc: k8s.KubeConfig;
  private namespace: string;
  private logger: Logger;
  constructor(
    private readonly kubernetesService: KubernetesService,
    private readonly projectStrategyResolver: ProjectStrategyResolver,
  ) {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.namespace = 'deployments';
    this.logger = new Logger(KubernetesController.name);
    // this.appsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    // this.coreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
  }
  onModuleInit() {
    const watch = new k8s.Watch(this.kc);
    watch.watch(
      `/api/v1/namespaces/${this.namespace}/pods`,
      {}, // Query params (e.g., label selectors) if needed
      async (type, pod) => {
        const conditions = pod.status.conditions || [];
        const podName = pod?.metadata?.name;
        const deploymentId =
          typeof podName === 'string' && podName.split('-').slice(-1).at(0);
        console.log({ deploymentId, status: pod?.status, type });

        const project = await this.projectStrategyResolver.resolve({
          deploymentId,
        });

        if (type === 'MODIFIED' && pod.status.phase === 'Failed') {
          if (!deploymentId) {
            throw new Error(
              `Failed to get deploymentId for podName=${podName}`,
            );
          }
          await project.handleDeploymentFailure({
            deploymentId: deploymentId,
            err: '',
          });
        }

        if (type === 'ADDED' && pod.status.phase === 'Running') {
          project.handleDeploymentRunningState(deploymentId);
        }

        // purposeful deleted will cause also get executed
        // if (type === 'DELETED') {
        //   await this.projectUseCase.handleDeploymentFailure({
        //     deploymentId,
        //     err: '',
        //   });
        //   return;
        // }

        const containerStatuses = pod?.status?.containerStatuses || [];
        for (const status of containerStatuses) {
          if (status?.state?.waiting?.reason === 'CrashLoopBackOff') {
            console.log(`Pod ${podName} is in CrashLoopBackOff.`);
            await project.handleDeploymentFailure({
              deploymentId,
              err: '',
            });
            await this.kubernetesService.stopDeployment(deploymentId);
            return;
          }
        }
      },
      (err) => {
        console.error('Watch error:', err);
      },
    );
  }
}
