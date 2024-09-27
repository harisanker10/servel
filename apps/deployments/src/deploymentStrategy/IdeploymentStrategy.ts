import { Injectable } from '@nestjs/common';
import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/dto';
import { BuildService } from 'src/build/build.service';
import { Env } from 'src/types/env';

@Injectable()
export abstract class DeploymentStrategy {
  constructor(
    protected readonly deploymentId: string,
    protected readonly deploymentType: ProjectType,
    protected readonly data: WebServiceData | ImageData | StaticSiteData,
    protected readonly env: Env | undefined,
  ) {}
  abstract build(): Promise<any>;
  abstract deploy(): Promise<any>;
  getData() {
    return this.data;
  }
}
