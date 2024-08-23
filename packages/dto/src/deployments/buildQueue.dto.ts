export interface Deployment {
  id: string;
  repoName: string;
  repoUrl: string;
  status: string;
  outDir: string;
  runCommand: string;
  buildCommand: string;
  userId: string;
  type: "web-service" | "static-site" | "image";
  createdAt: number;
  updatedAt: number;
}
