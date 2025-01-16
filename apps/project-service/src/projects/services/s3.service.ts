import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
    });
    this.bucket = process.env.S3_BUCKET;
  }

  async getFileContent(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      // Fetch the file
      const response = await this.client.send(command);

      // If file is not found, return an error or handle accordingly
      if (!response.Body) {
        throw new Error(`File not found: ${key}`);
      }

      // Convert the response body stream to a buffer and then to string
      const buffer = await this.streamToBuffer(response.Body);

      // Convert buffer to string (assuming the file is UTF-8 encoded)
      const fileContent = buffer.toString('utf-8');
      return fileContent;
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      throw error;
    }
  }

  // Helper method to convert ReadableStream to Buffer
  private async streamToBuffer(stream: any): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async getFileStream(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      const stream = response.Body; // This is the Readable stream
      return stream;
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      throw error;
    }
  }

  async createPresignedLink(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      // Generate the pre-signed URL
      const signedUrl = await getSignedUrl(this.client as any, command, {
        expiresIn,
      });
      return signedUrl;
    } catch (error) {
      console.error('Error creating pre-signed link:', error);
      throw error;
    }
  }

  async createUploadPresignedLink(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.client as any, command, {
        expiresIn,
      });
      return signedUrl;
    } catch (error) {
      console.error('Error creating upload pre-signed link:', error);
      throw error;
    }
  }

  // async streamUpload(key: string, body: any) {
  //   const upload = new Upload({
  //     client: this.client,
  //     params: {
  //       Bucket: this.bucket,
  //       Key: key,
  //       Body: body,
  //     },
  //   });
  //   return upload.done();
  // }

  // async uploadDir(directoryPath: string, s3BasePath: string) {
  //   const dirStats = await stat(directoryPath);
  //   if (!dirStats.isDirectory()) {
  //     throw new Error('Not a valid directory');
  //   }
  //
  //   const dirName = basename(directoryPath);
  //   const allFiles = await getAllFilePaths(directoryPath);
  //   for (const file of allFiles) {
  //     try {
  //       const relativePathAfterDir = file.split(directoryPath)[1];
  //       const s3Key = join(s3BasePath, relativePathAfterDir);
  //       const readStream = createReadStream(file);
  //       await this.streamUpload(s3Key, readStream);
  //       console.log(`Uploaded: ${s3Key}`);
  //     } catch (error) {
  //       console.error(`Failed to upload ${file}:`, error);
  //     }
  //   }
  // }

  getDeploymentDirKey(deploymentId: string) {
    return `deployments/${deploymentId}`;
  }
}
