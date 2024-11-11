import { V1Deployment, V1EnvVar, V1Job } from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class K8sManifestServic {
  constructor() {}

  createDeployment({
    deploymentName,
    image,
    envVars,
    port,
    replicas = 1,
  }: {
    deploymentName: string;
    image: string;
    envVars?: Record<string, string> | undefined;
    port: number;
    replicas?: number | undefined;
  }): V1Deployment {
    const env: V1EnvVar[] = [];
    for (const key in envVars) {
      env.push({
        name: key,
        value: envVars[key],
      });
    }
    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: deploymentName,
      },
      spec: {
        replicas: replicas,
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
                image,
                env,
                ports: [
                  {
                    containerPort: port,
                  },
                ],
                readinessProbe: {
                  httpGet: {
                    path: '/',
                    port: port,
                  },
                  initialDelaySeconds: 5,
                  periodSeconds: 10,
                },
              },
            ],
          },
        },
      },
    };
  }

  createServiceForDeployment({
    deploymentName,
    port,
    serviceName,
  }: {
    serviceName: string;
    port: number;
    deploymentName: string;
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

  createJob({jobName}:{jobName:string}) {
    return {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: { name: jobName },
      spec: {
        template: {
          spec: {
            containers: [
              {
                name: 'kaniko',
                image: 'gcr.io/kaniko-project/executor:latest',
                args: [
                  '--dockerfile=Dockerfile',
                  '--context=git://github.com/your-repo.git#branch',
                  '--destination=docker.io/your-repo/image:tag',
                  '--skip-tls-verify=true',
                ],
                volumeMounts: [
                  {
                    name: 'kaniko-secret',
                    mountPath: '/kaniko/.docker',
                  },
                ],
              },
            ],
            restartPolicy: 'Never',
            volumes: [
              {
                name: 'kaniko-secret',
                secret: {
                  secretName: 'regcred',
                },
              },
            ],
          },
        },
      },
    };
  }
}

const kanikoJob: V1Job = {
  apiVersion: 'batch/v1',
  kind: 'Job',
  metadata: { name: 'kaniko-build' },
  spec: {
    template: {
      spec: {
        containers: [
          {
            name: 'kaniko',
            image: 'gcr.io/kaniko-project/executor:latest',
            args: [
              '--dockerfile=Dockerfile',
              '--context=git://github.com/your-repo.git#branch',
              '--destination=docker.io/your-repo/image:tag',
              '--skip-tls-verify=true',
            ],
            volumeMounts: [
              {
                name: 'kaniko-secret',
                mountPath: '/kaniko/.docker',
              },
            ],
          },
        ],
        restartPolicy: 'Never',
        volumes: [
          {
            name: 'kaniko-secret',
            secret: {
              secretName: 'regcred',
            },
          },
        ],
      },
    },
  },
};
