import { readdir, lstat } from 'fs/promises';
import { join } from 'path';

export async function getAllFilePaths(dir: string): Promise<string[]> {
  const filePaths: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recursively get files from subdirectories
      const nestedFiles = await getAllFilePaths(fullPath);
      filePaths.push(...nestedFiles);
    } else if (entry.isFile()) {
      filePaths.push(fullPath);
    }
  }

  return filePaths;
}
