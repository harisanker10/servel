import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ReadStream, createReadStream } from 'fs';
import { relative } from 'path';
import { ENV } from 'src/config/env';
import { getAllFilePaths } from 'src/utils/getAllFilePaths';
import { Readable } from 'stream';

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
    // this.uploadDir('./proto', '');
  }

  async streamUpload(key: string, body: ReadStream | Readable) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
    });
    return this.client.send(command);
  }

  // async uploadDir(key: string, offset: string) {
  //   const allFiles = await getAllFilePaths(key);
  //   console.log({ allFiles });
  //   for (const file of allFiles) {
  //     const readStream = createReadStream(file);
  //     const sanitizedPath = relative(offset, file).replace(/\\/g, '/');
  //     await this.streamUpload(sanitizedPath, readStream);
  //   }
  // }
  //
  //
  async uploadDir(directoryPath: string, basePath: string, prefix: string) {
    const allFiles = await getAllFilePaths(directoryPath);
    console.log({ allFiles });

    for (const file of allFiles) {
      try {
        const relativePath = relative(basePath, file).replace(/\\/g, '/'); // Ensure forward slashes for S3 compatibility
        const s3Key = `${prefix}/${relativePath}`;
        const readStream = createReadStream(file);
        await this.streamUpload(s3Key, readStream);
        console.log(`Uploaded: ${s3Key}`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }
  }
}
