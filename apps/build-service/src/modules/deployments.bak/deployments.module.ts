// import { Module, forwardRef } from '@nestjs/common';
// import { DeploymentsService } from './deployments.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AppModule } from 'src/app.module';
// import { Deployment, DeploymentSchema } from 'src/schemas/deployment.schema';
// import { DeploymentsRepository } from 'src/repository/deployments.repository';
// import { KafkaModule } from '../kafka/kafka.module';
// import { KafkaService } from '../kafka/kafka.service';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Deployment.name, schema: DeploymentSchema },
//     ]),
//     forwardRef(() => AppModule),
//     KafkaModule,
//   ],
//   controllers: [],
//   providers: [DeploymentsService, DeploymentsRepository, KafkaService],
//   exports: [DeploymentsService, DeploymentsRepository],
// })
// export class DeploymentsModule {}
