export enum DeploymentType {
  webService = 0,
  staticSite = 1,
  dockerImage = 2,
  UNRECOGNIZED = -1,
}

export enum InstanceType {
  tier_0 = 0,
  tier_1 = 1,
  tier_2 = 2,
}

export enum DeploymentStatus {
  queued = "queued",
  building = "building",
  deploying = "deploying",
  deployed = "deployed",
  failed = "failed",
  stopped = "stopped",
}
