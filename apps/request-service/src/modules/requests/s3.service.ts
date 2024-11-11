import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3 {
  private readonly client: S3Client;
  constructor(
    private readonly bucket: string,
    private readonly configService: ConfigService,
  ) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESSKEYID'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRETACCESSKEY'),
      },
      region: this.configService.getOrThrow('S3_REGION'),
    });
  }

  async getObjectReadStream(key: string) {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: this.bucket,
    });
    return this.client.send(command);
  }
}
