// import { InjectModel } from '@nestjs/mongoose';
// import { Document, Model, Types } from 'mongoose';
// import { Deployment, DeploymentDoc } from 'src/schemas/deployment.schema';
//
// export class DeploymentsRepository {
//   constructor(
//     @InjectModel(Deployment.name) private deploymentModel: Model<DeploymentDoc>,
//   ) {}
//
//   async createDeployment(
//     data: Omit<Deployment, 'status'>,
//   ): Promise<DeploymentDoc> {
//     return new this.deploymentModel({ ...data })
//       .save()
//       .then((doc) => doc.toObject());
//   }
//
//   getDeployment(deploymentId: string): Promise<DeploymentDoc> {
//     return this.deploymentModel.findOne({ projectId: deploymentId });
//   }
//
//   async updateDeployment({
//     deploymentId,
//     updates,
//   }: {
//     deploymentId: string;
//     updates: Partial<Deployment>;
//   }) {
//     return this.deploymentModel.findOneAndUpdate(
//       { deploymentId },
//       { ...updates },
//     );
//   }
// }
