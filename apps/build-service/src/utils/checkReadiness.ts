import * as k8s from '@kubernetes/client-node';
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

// returns a promise that resolves when atleast one replica of deployment gets ready
export default function checkDeploymentReplicaReadiness(
  deploymentId: string,
  namespace = 'default',
  maxWaitTimeInSeconds = 120,
) {
  let checks = 0;
  return new Promise((res, rej) => {
    const interval = setInterval(() => {
      appsApi
        .readNamespacedDeployment(deploymentId, namespace)
        .then((depl) => {
          if (depl.body.status.readyReplicas) {
            console.log(`Pod ${deploymentId} is ready`);
            clearInterval(interval);
            res(true);
          }
          if (++checks >= maxWaitTimeInSeconds) {
            console.log(
              `Pod ${deploymentId} is not ready after maxWaitTime:`,
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
