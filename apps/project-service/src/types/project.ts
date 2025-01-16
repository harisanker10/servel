import { InstanceType, ProjectStatus, ProjectType } from '@servel/common/types';
import { BaseDoc } from './baseDoc';
import { Deployment } from './deployment';

export interface PopulatedProject extends Project {
  deployments: Deployment[];
}

export interface Project extends BaseDoc {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  deploymentUrl?: string | undefined;
  status: ProjectStatus;
  userId: string;
}
