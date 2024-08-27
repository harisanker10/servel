import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateWebServiceDto,
  DEPLOYMENTS_SERVICE_NAME,
  DeploymentsServiceClient,
  ZodValidationPipe,
  createWebServiceSchema,
} from '@servel/dto';
import { lastValueFrom } from 'rxjs';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('/deployments')
@UseGuards(JWTGuard)
export class DeploymentsController implements OnModuleInit {
  private deploymentsGrpcService: DeploymentsServiceClient;
  constructor(@Inject('deployments') private client: ClientGrpc) {}
  onModuleInit() {
    this.deploymentsGrpcService =
      this.client.getService<DeploymentsServiceClient>(
        DEPLOYMENTS_SERVICE_NAME,
      );
  }

  @Post('/')
  async createDeployment(@Req() req: any, @Body() depl: any) {
    console.log({ depl });

    const deployemnt = {
      userId: req.user.id,
      ...depl,
    };

    console.log({ deployemnt });

    const webService = await lastValueFrom(
      this.deploymentsGrpcService.createWebService(deployemnt),
    );
    return webService;
  }

  @Get('/')
  async getDeploymentsOfUser(@Req() req: Request & { user: { id: string } }) {
    return this.deploymentsGrpcService.getUsersDeployments({
      userId: req?.user?.id,
    });
  }

  @Get('/:id')
  async getDeployment(@Param('id') id) {
    return this.deploymentsGrpcService.getDeployment({ id });
  }
}
