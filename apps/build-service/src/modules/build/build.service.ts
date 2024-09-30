import { Injectable } from '@nestjs/common';
import { InstanceType, WebServiceData } from '@servel/dto';
import { exec, spawn } from 'child_process';
import { randomInt } from 'crypto';
import { join } from 'path';
import { Env } from 'src/types/env';
import { createDockerFile } from 'src/utils/createDockerfile';
import { applyKubernetesConfiguration } from 'src/utils/createK8Deployment';

interface BuildWebService {
  env: Record<string, string>;
  repoName: string;
  repoUrl: string;
  deploymentId: string;
  buildCommand: string;
  runCommand: string;
  instanceType: InstanceType;
  version: number;
}

@Injectable()
export class BuildService {
  async buildddd(
    depl: WebServiceData & {
      repoName: string;
      deploymentId: string;
      env?: Env | undefined;
      instanceType: InstanceType | undefined;
    },
  ) {
    const image = `harisanker10/${depl.deploymentId}`;
    let envVars = {
      GIT_REPO_URL: depl.repoUrl,
      DEPL_ID: depl.deploymentId,
      dockerfile: createDockerFile({
        os: 'node:alpine',
        runCommand: depl.runCommand,
        buildCommand: depl.buildCommand,
        port: depl.port,
      }),
      image: image,
    };
    if (depl.env && depl.env.values) {
      envVars = { ...envVars, ...depl.env.values };
    }
    const process = spawn('docker', ['run', 'node:alpine', ''], {
      env: envVars,
    });
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    process.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    const buildData = await Promise.any([
      new Promise((res, rej) => {
        process.on('exit', (code) => {
          if (code !== 0) {
            console.log(`Exited with exit code ${code}`);
            rej(false);
          }
          res(true);
        });
      }),
      new Promise((res, rej) => {
        process.on('disconnect', (err) => {
          console.log('Disconnected from process', err);
          rej(false);
        });
      }),
      new Promise((res, rej) => {
        process.on('error', (err) => {
          console.log(err);
          rej(false);
        });
      }),
      new Promise((res, rej) => {
        process.on('close', (code) => {
          if (code !== 0) {
            console.log(`Exited with exit code ${code}`);
            rej(false);
          }
          res(true);
        });
      }),
    ]);

    if (buildData) {
      return { image };
    }
    return false;
  }

  async buildWebService(
    depl: WebServiceData & {
      repoName: string;
      deploymentId: string;
      env?: Env | undefined;
      instanceType: InstanceType | undefined;
    },
  ) {
    const scriptPath = join(__dirname, '../../scripts/build.sh');
    exec(`chmod +x ${scriptPath}`);

    const image = `harisanker10/${depl.deploymentId}`;
    const buildProcess = spawn(scriptPath, null, {
      env: {
        ...process.env,
        GIT_REPO_NAME: depl.repoName,
        GIT_REPO_URL: depl.repoUrl,
        DEPL_ID: depl.deploymentId,
        dockerfile: createDockerFile({
          os: 'node:alpine',
          runCommand: depl.runCommand,
          buildCommand: depl.buildCommand,
          port: depl.port,
        }),
        image: image,
      },
    });

    buildProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    buildProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    const buildData = await Promise.any([
      new Promise((res, rej) => {
        buildProcess.on('exit', (code) => {
          if (code !== 0) {
            console.log(`Exited with exit code ${code}`);
            rej(false);
          }
          res(true);
        });
      }),
      new Promise((res, rej) => {
        buildProcess.on('disconnect', (err) => {
          console.log('Disconnected from process', err);
          rej(false);
        });
      }),
      new Promise((res, rej) => {
        buildProcess.on('error', (err) => {
          console.log(err);
          rej(false);
        });
      }),
      new Promise((res, rej) => {
        buildProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(`Exited with exit code ${code}`);
            rej(false);
          }
          res(true);
        });
      }),
    ]);

    if (buildData) {
      return { image };
    }
    return false;
  }

  async runWebService(image: string, id: string, port: number) {
    console.log('Running web service...', { image, id, port });
    const nodePort = randomInt(30001, 32000);
    await applyKubernetesConfiguration(
      `deployment${id}`,
      `container${id}`,
      image,
      `service-${id}`,
      port,
      nodePort,
    );
    return nodePort;
  }
}
