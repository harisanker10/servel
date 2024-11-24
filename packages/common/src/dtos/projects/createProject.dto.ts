import { createProjectSchema } from "src/schemas";
import { PopulatedProject } from "src/types";
import { z } from "zod";

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type CreateProjectDtoRes = PopulatedProject;

/*
message PopulatedProject {
  string id = 1;
  string name = 2;
  string status = 3;
  string createdAt = 5;
  string updatedAt = 6;
  string deploymentUrl = 7;
  ProjectType projectType = 8;
  repeated Deployment deployments = 9;
}

message Deployment {
  string id = 1;
  string createdAt = 2;
  string updatedAt = 3;
  string status = 4;
  oneof type {
    ImageData imageData = 5;
    WebServiceData webServiceData = 6;
    StaticSiteData staticSiteData = 7;
  }
  optional string env = 8;
}

{
  string imageUrl = 1;
  optional string accessToken = 2;
  int32 port = 3;
}

message WebServiceData {
  string repoUrl = 1;
  string runCommand = 2;
  string buildCommand = 3;
  optional string accessToken = 4;
  optional string branch = 5;
  optional string commitId = 6;
  int32 port = 7;
}

message StaticSiteData {
  string repoUrl = 1;
  string outDir = 2;
  string buildCommand = 3;
  optional string accessToken = 4;
  optional string branch = 5;
  optional string commitId = 6;
}



*/
