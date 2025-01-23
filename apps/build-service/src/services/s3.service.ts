import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path, { basename, join, relative } from 'path';
import { ENV } from 'src/config/env';
import { getAllFilePaths } from 'src/utils/getAllFilePaths';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY,
        secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
      },
      region: ENV.S3_REGION,
    });
    this.bucket = ENV.S3_BUCKET;
    console.log({
      credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY,
        secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
      },
      region: ENV.S3_REGION,
    });
  }

  async streamUpload(key: string, body: any) {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
      },
    });
    return upload.done();
  }

  async uploadDir(directoryPath: string, s3BasePath: string) {
    const dirStats = await stat(directoryPath);
    if (!dirStats.isDirectory()) {
      throw new Error('Not a valid directory');
    }

    const dirName = basename(directoryPath);
    const allFiles = await getAllFilePaths(directoryPath);
    for (const file of allFiles) {
      try {
        const relativePathAfterDir = file.split(directoryPath)[1];
        const s3Key = join(s3BasePath, relativePathAfterDir);
        const readStream = createReadStream(file);
        await this.streamUpload(s3Key, readStream);
        console.log(`Uploaded: ${s3Key}`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }
  }

  getDeploymentDirKey(deploymentId: string) {
    return `deployments/${deploymentId}`;
  }
}
