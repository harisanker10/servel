import {
  All,
  Controller,
  Inject,
  Logger,
  Next,
  Req,
  Res,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';
import { S3 } from './s3.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopics, RequestDto } from '@servel/common';
import { DeploymentStatus, ProjectType } from '@servel/common/types';

@Controller('*')
export class RequestController {
  private logger: Logger;
  constructor(
    private readonly deploymentRepository: DeploymentsRepository,
    private readonly s3service: S3,
    @Inject('kafka-service') private readonly kafkaServic: ClientKafka,
  ) {
    this.logger = new Logger(RequestController.name);
  }

  @All()
  async serve(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      console.log({ subdomain: req.subdomains });
      const deplName = req.subdomains[0];
      if (!deplName) {
        throw new Error('Depl stopped');
      }

      const deployment =
        await this.deploymentRepository.getDeploymentWithProjectName(deplName);
      this.logger.log(
        `Found depl corresponding to req domaing ${req.subdomains[0]}`,
        deployment,
      );
      if (!deployment?.id) {
        throw new Error(
          `No Deployment found for subdomain ${req.subdomains[0]}`,
        );
      }

      if (deployment.projectType === ProjectType.STATIC_SITE) {
        if (deployment.status !== DeploymentStatus.ACTIVE) {
          throw new Error('Depl stopped');
        }
        const analytics: RequestDto = {
          deploymentId: deployment.deploymentId,
          method: req.method,
          url: req.url,
          ip: req.ip || (req.headers['x-forwarded-for'] as string), // IP address
          userAgent: req.headers['user-agent'], // User-Agent header
          referer: req.headers['referer'], // Referer header
          timestamp: new Date().toISOString(), // Timestamp
        };
        this.kafkaServic.emit(KafkaTopics.ANALYTICS_EVENT, analytics);
        const host = req.hostname;
        const id = host.split('.')[0];
        let filePath = req.path;
        if (filePath === '/') filePath = '/index.html';
        const key = `${deployment.bucketPath}${filePath}`;
        this.logger.log(`serving file at ${key}`);
        const type = filePath.endsWith('html')
          ? 'text/html'
          : filePath.endsWith('css')
            ? 'text/css'
            : 'application/javascript';
        const content = await this.s3service.getObjectReadStream(key);
        const page = await content.Body?.transformToString();
        res.set('Content-Type', type);
        res.send(page);
      } else if (
        deployment.projectType === ProjectType.WEB_SERVICE ||
        deployment.projectType === ProjectType.IMAGE
      ) {
        const analytics: RequestDto = {
          deploymentId: deplName,
          method: req.method,
          url: req.url,
          ip: req.ip || (req.headers['x-forwarded-for'] as string), // IP address
          userAgent: req.headers['user-agent'], // User-Agent header
          referer: req.headers['referer'], // Referer header
          timestamp: new Date().toISOString(), // Timestamp
        };
        this.kafkaServic.emit(KafkaTopics.ANALYTICS_EVENT, analytics);
        // const clusterServiceUrl = `http://${deployment.clusterServiceName}:${deployment.port}`;
        const clusterServiceUrl = `http://${deployment.clusterServiceName}.${'deployments'}.svc.cluster.local:${deployment.port}`;

        console.log({ clusterServiceUrl });

        return createProxyMiddleware({
          target: clusterServiceUrl,
          changeOrigin: true,
        })(req, res, next);
      }
    } catch (err) {
      this.logger.error(err);
      res.status(404).send('<h1>404 Not Found</h1>');
    }
  }
}
