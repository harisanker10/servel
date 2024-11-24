import { Injectable } from '@nestjs/common';
import { ImageData, StaticSiteData, WebServiceData } from '@servel/common';
import { DeploymentData } from 'src/types/deployment';
import { Env } from 'src/types/env';

@Injectable()
export abstract class DeploymentStrategy {
  protected readonly data: {
    deploymentName: string;
    deploymentId: string;
  } & (WebServiceData | ImageData | StaticSiteData);
  protected readonly env: Env | undefined;
  constructor({ data, env }: { data: DeploymentData; env: Env | undefined }) {
    this.data = data;
    this.env = env;
  }
  abstract build(): Promise<any>;
  abstract deploy(): Promise<any>;
  getData() {
    return { ...this.data, env: this.env };
  }
}
