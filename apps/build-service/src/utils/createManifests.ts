import {
  V1Deployment,
  V1EnvVar,
  V1ResourceRequirements,
  V1Service,
} from '@kubernetes/client-node';
import { InstanceType } from '@servel/common/types';
import { randomInt } from 'crypto';

export function createDeploymentManifest({
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
              // readinessProbe: {
              //   httpGet: {
              //     path: '/',
              //     port: port,
              //   },
              //   initialDelaySeconds: 5,
              //   periodSeconds: 10,
              // },
              resources: instanceTypeToResources(instanceType),
            },
          ],
        },
      },
    },
  } as V1Deployment;
}

function instanceTypeToResources(
  instanceType: InstanceType,
): V1ResourceRequirements {
  switch (instanceType) {
    case InstanceType.TIER_0: {
      return {
        limits: {
          cpu: '100m',
          memory: '512Mi',
        },
        requests: {
          cpu: '50m',
          memory: '256Mi',
        },
      };
    }

    case InstanceType.TIER_1: {
      return {
        limits: {
          cpu: '1',
          memory: '1024Mi',
        },
        requests: {
          cpu: '500m',
          memory: '512Mi',
        },
      };
    }

    case InstanceType.TIER_2: {
      return {
        limits: {
          cpu: '2',
          memory: '2048Mi',
        },
        requests: {
          cpu: '1',
          memory: '1024Mi',
        },
      };
    }
  }
}

export function createServiceManifest({
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
              // readinessProbe: {
              //   httpGet: {
              //     path: '/',
              //     port: port,
              //   },
              //   initialDelaySeconds: 5,
              //   periodSeconds: 10,
              // },
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
