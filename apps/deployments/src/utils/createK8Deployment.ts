import * as k8s from '@kubernetes/client-node';
import { createKubernetesYaml } from './createManifests';

export async function applyKubernetesConfiguration(
  deploymentName: string,
  containerName: string,
  imageName: string,
  serviceName: string,
  port: number,
  nodePort: number,
) {
  console.log('applying k8 manifest');
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  console.log('loaded');

  const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
  const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

  console.log('created client');

  const { deployment, service } = createKubernetesYaml(
    deploymentName,
    containerName,
    imageName,
    serviceName,
    port,
    nodePort,
  );

  try {
    await k8sApi.createNamespacedDeployment('default', deployment);
    console.log(`Deployment ${deploymentName} created.`);

    const data = await coreV1Api.createNamespacedService('default', service);

    console.log(`Service ${serviceName} created.`);
  } catch (err) {
    console.error('Error applying configuration:', err);
  }
}
