import { z } from "zod";

export const createDeploymentsSchema = z.object({
  type: z.enum(["web-service", "static-site", "image"], {
    message: "Deployment type is required",
  }),
  url: z.string({ message: "Repository URL is required" }),
  outDir: z.string({ message: "Output directory is required" }).optional(),
  buildCommand: z.string({ message: "Build command is required" }).optional(),
  runCommand: z.string({ message: "Run command is required" }).optional(),
});

export type CreateDeploymentDto = z.infer<typeof createDeploymentsSchema>;
// Example usage:
// const exampleDeployment = {
//   repoName: "my-repo",
//   type: "web-service",
//   repoUrl: "https://github.com/user/my-repo",
//   deploymentUrl: "https://my-deployment-url.com",
//   outDir: "dist",
//   buildCommand: "npm run build",
//   runCommand: "npm start",
//   status: "queued",
//   userId: "user123",
//   githubAccessToken: "token123",
// };
