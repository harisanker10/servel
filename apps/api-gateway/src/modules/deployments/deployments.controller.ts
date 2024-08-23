import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Param,
  Post,
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
  @UsePipes(new ZodValidationPipe(createWebServiceSchema))
  async createDeployment(@Body() depl: CreateWebServiceDto) {
    const webService = await lastValueFrom(
      this.deploymentsGrpcService.createWebService(depl),
    );
    return webService;
  }

  @Get('/:id')
  async getDeployment(@Param('id') id){
    const 
  }
}
