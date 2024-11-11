import { V1Deployment, V1EnvVar, V1Service } from '@kubernetes/client-node';
import { randomInt } from 'crypto';

export function createKubernetesYaml(
  deploymentName: string,
  containerName: string,
  imageName: string,
  serviceName: string,
  port: number,
  env?: Record<string, string>,
): { deployment: V1Deployment; service: V1Service } {
  const envs: V1EnvVar[] = [];
  for (const key in env) {
    envs.push({ name: key, value: env[key] });
  }

  const deploymentYaml: V1Deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: deploymentName,
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
              name: containerName,
              image: imageName,
              env: envs,
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

  const serviceYaml = {
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

  return {
    deployment: deploymentYaml,
    service: serviceYaml,
  };
}
