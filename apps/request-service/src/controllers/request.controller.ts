import { All, Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';

@Controller('*')
export class RequestController {
  constructor(private readonly deploymentRepository: DeploymentsRepository) {}

  @All()
  serve(@Req() req: Request) {
    console.log({
      baseUrl: req.baseUrl,
      url: req.url,
      ogUrl: req.originalUrl,
      subdomains: req.subdomains,
    });
    return { success: true };
  }
}
