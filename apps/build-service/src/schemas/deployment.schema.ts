// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import {
//   DeploymentStatus,
//   ImageData,
//   ProjectType,
//   StaticSiteData,
//   WebServiceData,
// } from '@servel/dto';
// import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
//
// @Schema({
//   collection: 'deployments',
//   versionKey: false,
//   timestamps: true,
//   id: true,
//   toObject: {
//     transform(doc, ret) {
//       ret.id = ret._id;
//       delete ret._id;
//       return ret as Record<string, any> & { id: string };
//     },
//   },
// })
// export class Deployment {
//   @Prop({
//     enum: DeploymentStatus,
//     default: DeploymentStatus.starting,
//   })
//   status: DeploymentStatus;
//
//   @Prop({ required: true })
//   deploymentId: string;
//
//   @Prop({ type: String, required: true, enum: ProjectType })
//   projectType: ProjectType;
//
//   @Prop({
//     type: MongooseSchema.Types.Mixed, // Allows mixed type
//     oneOf: [
//       {
//         type: 'WebService',
//         repoUrl: String,
//         runCommand: String,
//         buildCommand: String,
//         port: Number,
//       },
//       {
//         type: 'StaticSite',
//         repoUrl: String,
//         outDir: String,
//         buildCommand: String,
//       },
//       {
//         type: 'Image',
//         imageUrl: String,
//         port: Number,
//       },
//     ],
//     required: true,
//   })
//   data: WebServiceData | ImageData | StaticSiteData;
//
//   @Prop()
//   accessToken?: string | undefined;
//
//   @Prop({ type: { id: String, values: {} } })
//   env?: { id: string; values: Record<string, string> } | undefined;
// }
//
// export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
//
// export type DeploymentDoc = HydratedDocument<Deployment> & {
//   id: string;
//   createdAt: number;
//   updatedAt: number;
// };
