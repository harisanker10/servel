import { BaseDoc } from './baseDoc';

export interface Analytics extends BaseDoc {
  deploymentId: string;
  ip: string;
  method: string;
  url: string;
  userAgent: string;
  referer: string;
  timestamp: string;
}

export interface IAnalyticsRepository {
  createAnalytics(): Promise<Analytics>;
  getAnalyticsWithProjectId(projectId: string): Promise<Analytics[]>;
}
