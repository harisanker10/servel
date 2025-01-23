// import { Inject, Injectable } from '@nestjs/common';
// import { ProjectType, StaticSiteData, WebServiceData } from '@servel/dto';
// import { ClientKafka } from '@nestjs/microservices';
// import { DeploymentsRepository } from 'src/repository/deployments.repository';
// import { Deployment } from 'src/schemas/deployment.schema';
//
// @Injectable()
// export class DeploymentsService {
//   constructor(private readonly deplRepository: DeploymentsRepository) {}
//
//   createDeployment(data: Omit<Deployment, 'status'>) {
//     return this.deplRepository.createDeployment(data);
//   }
//
//   getDeployment(deploymentId: string) {
//     return this.deplRepository.getDeployment(deploymentId);
//   }
//
//   updateDeployment(deploymentId: string, updates: Partial<Deployment>) {
//     return this.deplRepository.updateDeployment({ deploymentId, updates });
//   }
// }
