export enum KafkaTopics {
  BUILD_AND_DEPLOY_QUEUE = "queue.buildAndDeploy",
  DEPLOYMENT_QUEUE = "queue.deployment",

  DEPLOYMENT_BUILDING_EVENT = "events.status.building.deployment",
  DEPLOYMENT_BUILT_EVENT = "events.status.built.deployment",
  DEPLOYMENT_DEPLOYING_EVENT = "events.status.deploying.deployment",
  DEPLOYMENT_DEPLOYED_EVENT = "events.status.deployed.deployment",
  DEPLOYMENT_STOPPED_EVENT = "events.status.stopped.deployment",
  DEPLOYMENT_FAILED_EVENT = "events.status.failed.deployment",

  ANALYTICS_EVENT = "events.analytics",
}
