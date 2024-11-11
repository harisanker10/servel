import { spawn } from 'child_process';

export async function cloneRepository(
  gitUrl: string,
  repoPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cloneProcess = spawn('git', ['clone', gitUrl, repoPath]);

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
