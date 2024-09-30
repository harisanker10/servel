import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';
import { S3 } from './s3.service';
import axios from 'axios';

@Controller('*')
export class RequestController {
  constructor(
    private readonly deploymentRepository: DeploymentsRepository,
    private readonly s3service: S3,
  ) {}

  @All()
  async serve(@Req() req: Request, @Res() res: Response) {
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

      if (deployment.s3Path) {
        const host = req.hostname;
        const id = host.split('.')[0];
        let filePath = req.path;
        if (filePath === '/') filePath = '/index.html';
        const key = `${id}${filePath}`;
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
        const clusterServiceUrl = `http://${deployment.clusterServiceName}:${deployment.port}${req.url}`;

        const response = await axios({
          method: req.method,
          url: clusterServiceUrl,
          headers: req.headers,
          data: req.body,
        });

        res.status(response.status).send(response.data);
      }
    } catch (err) {
      console.log({ err });
      res.status(404).send('<h1>404 Not Found</h1>');
    }
  }
}
