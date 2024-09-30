import { V1Deployment, V1Service } from '@kubernetes/client-node';
import { randomInt } from 'crypto';

export function createKubernetesYaml(
  deploymentName: string,
  containerName: string,
  imageName: string,
  serviceName: string,
  port: number,
  nodePort: number,
): { deployment: V1Deployment; service: V1Service } {
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
      type: 'NodePort',
      ports: [
        {
          port: port,
          targetPort: port,
          protocol: 'TCP',
          name: deploymentName,
          nodePort,
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
