import { Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { rm, stat } from 'fs/promises';

const logger = new Logger('CloneProcess');

export async function cloneRepository(
  gitUrl: string,
  repoPath: string,
): Promise<void> {
  const repoStat = await stat(repoPath);
  if (repoStat.isDirectory()) {
    await rm(repoPath, { recursive: true, force: true });
  }
  return new Promise(async (resolve, reject) => {
    const cloneProcess = spawn('git', ['clone', gitUrl, repoPath]);
    cloneProcess.stdout.on('data', (data) => {
      logger.log(data.toString());
    });
    cloneProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Git clone failed with code ${code}`));
      } else {
        resolve();
      }
    });

    cloneProcess.on('error', reject);
  });
}
