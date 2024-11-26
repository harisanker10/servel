import { All, Controller, Inject, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';
import { S3 } from './s3.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientKafka } from '@nestjs/microservices';
import { DeploymentStatus, KafkaTopics, RequestDto } from '@servel/common';

@Controller('*')
export class RequestController {
  constructor(
    private readonly deploymentRepository: DeploymentsRepository,
    private readonly s3service: S3,
    @Inject('kafka-service') private readonly kafkaServic: ClientKafka,
  ) {}

  @All()
  async serve(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      console.log({
        baseUrl: req.baseUrl,
        url: req.url,
        ogUrl: req.originalUrl,
        subdomains: req.subdomains,
      });

      const deploymentId = req.subdomains[0];
      if (!deploymentId) {
        res.status(404).send('<h1>404 Not Found</h1>');
      }

      const deployment =
        await this.deploymentRepository.getDeployment(deploymentId);
      if (!deployment?.id) {
        res.status(404).send('<h1>404 Not Found</h1>');
      }

      console.log('got corresponding deployment for req', { deployment });

      if (deployment.s3Path) {
        if (deployment.status !== DeploymentStatus.active) {
          throw new Error('Depl stopped');
        }
        const analytics: RequestDto = {
          deploymentId: deploymentId,
          method: req.method,
          url: req.url,
          ip: req.ip || (req.headers['x-forwarded-for'] as string), // IP address
          userAgent: req.headers['user-agent'], // User-Agent header
          referer: req.headers['referer'], // Referer header
          timestamp: new Date().toISOString(), // Timestamp
        };
        this.kafkaServic.emit(KafkaTopics.requests, analytics);
        const host = req.hostname;
        const id = host.split('.')[0];
        let filePath = req.path;
        if (filePath === '/') filePath = '/index.html';
        const key = `repositories/${id}${filePath}`;
        const type = filePath.endsWith('html')
          ? 'text/html'
          : filePath.endsWith('css')
            ? 'text/css'
            : 'application/javascript';
        console.log({ id, filePath, key, type });
        const content = await this.s3service.getObjectReadStream(key);
        const page = await content.Body?.transformToString();
        res.set('Content-Type', type);
        res.send(page);
        // (content.Body as Readable).pipe(res);
      } else if (deployment.clusterServiceName) {
        const analytics: RequestDto = {
          deploymentId: deploymentId,
          method: req.method,
          url: req.url,
          ip: req.ip || (req.headers['x-forwarded-for'] as string), // IP address
          userAgent: req.headers['user-agent'], // User-Agent header
          referer: req.headers['referer'], // Referer header
          timestamp: new Date().toISOString(), // Timestamp
        };
        this.kafkaServic.emit(KafkaTopics.requests, analytics);
        const clusterServiceUrl = `http://${deployment.clusterServiceName}:${deployment.port}`;

        console.log({ clusterServiceUrl });

        return createProxyMiddleware({
          target: clusterServiceUrl,
          changeOrigin: true,
          // onError(err, req, res) {
          //   console.error('Proxy Error:', err.message);
          //   res.status(500).send('Error forwarding request to cluster service.');
          // },
        })(req, res, next);

        // const response = await axios({
        //   method: req.method,
        //   url: clusterServiceUrl,
        //   headers: req.headers,
        //   data: req.body,
        // });
        // console.log({ response });
        //
        // res.status(response.status).send(response.data);
      }
    } catch (err) {
      console.log({ err });
      res.status(404).send('<h1>404 Not Found</h1>');
    }
  }
}
