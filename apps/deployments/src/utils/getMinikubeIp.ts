import { exec } from 'child_process';

export function getMinikubeIp() {
  const process = exec('minikube ip');
  return new Promise((res, rej) => {
    process.stdout?.on('data', (data) => {
      const ip = data.toString().trim();
      if (data.split('.').length === 4) {
        res(data);
      } else {
        rej(null);
      }
    });
  });
}
