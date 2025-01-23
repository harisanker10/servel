import {
  V1Deployment,
  V1EnvVar,
  V1ResourceRequirements,
  V1Service,
} from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { InstanceType } from '@servel/common/types';

@Injectable()
export class ManifestService {
  constructor() {}
  private instanceTypeToResources(
    instanceType: InstanceType,
  ): V1ResourceRequirements {
    const resources = {
      [InstanceType.TIER_0]: {
        limits: { cpu: '100m', memory: '512Mi' },
        requests: { cpu: '50m', memory: '256Mi' },
      },
      [InstanceType.TIER_1]: {
        limits: { cpu: '1', memory: '1024Mi' },
        requests: { cpu: '500m', memory: '512Mi' },
      },
      [InstanceType.TIER_2]: {
        limits: { cpu: '2', memory: '2048Mi' },
        requests: { cpu: '1', memory: '1024Mi' },
      },
    };

    return resources[instanceType];
  }

  createDeploymentManifest({
    deploymentName,
    port,
    imageName,
    envs,
    instanceType = InstanceType.TIER_0,
    namespace,
  }: {
    deploymentName: string;
    imageName: string;
    port: number;
    envs?: { name: string; value: string }[];
    instanceType: InstanceType;
    namespace: string;
  }): V1Deployment {
    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: deploymentName,
        namespace,
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: deploymentName,
          },
        },
        template: {
          metadata: {
            labels: {
              app: deploymentName,
            },
          },
          spec: {
            containers: [
              {
                name: deploymentName,
                image: imageName,
                env: envs,
                ports: [
                  {
                    containerPort: port,
                  },
                ],
                resources: this.instanceTypeToResources(instanceType),
              },
            ],
          },
        },
      },
    } as V1Deployment;
  }

  createServiceManifest({
    serviceName,
    port,
    deploymentName,
  }: {
    serviceName: string;
    deploymentName: string;
    port: number;
  }) {
    return {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: serviceName,
      },
      spec: {
        type: 'ClusterIP',
        ports: [
          {
            port: port,
            targetPort: port,
            protocol: 'TCP',
          },
        ],
        selector: {
          app: deploymentName,
        },
      },
    };
  }

  createPodManifest({
    podName,
    port,
    imageName,
    envs,
    instanceType = InstanceType.TIER_0,
    namespace,
  }: {
    podName: string;
    imageName: string;
    port: number;
    envs?: { name: string; value: string }[];
    instanceType: InstanceType;
    namespace: string;
  }) {
    return {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: podName,
        namespace,
        labels: {
          app: podName,
        },
      },
      spec: {
        containers: [
          {
            name: podName,
            image: imageName,
            env: envs,
            ports: [
              {
                containerPort: port,
              },
            ],
            // readinessProbe: {
            //   httpGet: {
            //     path: '/',
            //     port: port,
            //   },
            //   initialDelaySeconds: 5,
            //   periodSeconds: 10,
            // },
            resources: this.instanceTypeToResources(instanceType),
          },
        ],
      },
    };
  }
}

// const kanikoJob: V1Job = {
//   apiVersion: 'batch/v1',
//   kind: 'Job',
//   metadata: { name: 'kaniko-build' },
//   spec: {
//     template: {
//       spec: {
//         containers: [
//           {
//             name: 'kaniko',
//             image: 'gcr.io/kaniko-project/executor:latest',
//             args: [
//               '--dockerfile=Dockerfile',
//               '--context=git://github.com/your-repo.git#branch',
//               '--destination=docker.io/your-repo/image:tag',
//               '--skip-tls-verify=true',
//             ],
//             volumeMounts: [
//               {
//                 name: 'kaniko-secret',
//                 mountPath: '/kaniko/.docker',
//               },
//             ],
//           },
//         ],
//         restartPolicy: 'Never',
//         volumes: [
//           {
//             name: 'kaniko-secret',
//             secret: {
//               secretName: 'regcred',
//             },
//           },
//         ],
//       },
//     },
//   },
// };
