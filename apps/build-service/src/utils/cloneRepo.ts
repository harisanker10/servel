import { Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { rm, stat } from 'fs/promises';

const logger = new Logger('CloneProcess');

export async function cloneRepository(
  gitUrl: string,
  repoPath: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const repoStat = await stat(repoPath);
      if (repoStat.isDirectory()) {
        console.log(`Removing existing directory at ${repoPath}`);
        await rm(repoPath, { recursive: true, force: true });
      }
    } catch (error) {
      console.log('Error removing repoPath:', repoPath, 'err:', error);
    }
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
