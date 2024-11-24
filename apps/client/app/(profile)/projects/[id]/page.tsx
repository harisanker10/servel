"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GitBranch,
  GitCommit,
  Globe,
  Loader2,
  Play,
  RefreshCcw,
  RotateCcw,
  StopCircle,
} from "lucide-react";
import { getProject } from "@/actions/projects/getProject";
import {
  Deployment,
  Project,
  ProjectStatus,
  StaticSiteData,
  WebServiceData,
} from "@servel/common/types";
import { stopProject } from "@/actions/projects/stopProject";
import { retryDeployment } from "@/actions/deployments/retryDeployment";

export default function ProjectView() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const params = useParams();

  const [deployments, setDeployments] = useState<
    Deployment<WebServiceData | StaticSiteData>[] | null
  >(null);

  useEffect(() => {
    //@ts-ignore
    const projectId: string = params.id;
    getProject(projectId).then((project) => {
      console.log({ project, deployments: project.deployments });
      project && setProject(project);
      project.deployments && setDeployments(project.deployments);
    });
  }, []);
  const handleStopDeployment = async () => {
    if (project?.id) {
      await stopProject(project?.id);
      router.push("/projects");
    }
  };

  const handleRedeployment = () => {
    console.log("Redeploying");
    // Add logic to redeploy
  };

  const handleRollback = () => {
    console.log("Rolling back deployment");
    // Add logic to rollback deployment
  };

  const handleStart = () => {
    if (deployments?.length) {
      const depl = deployments[deployments?.length - 1];
      if (depl && "id" in depl) {
        retryDeployment(depl.id);
      }
    }
  };

  const getStatusBadge = (status: any) => {
    const variants = {
      active: "success",
      completed: "default",
      failed: "destructive",
      starting: "warning",
    };
    return <Badge variant={variants[status] || "success"}>{status}</Badge>;
  };

  if (!project || !project.id) {
    return <Loader2 />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
          <CardDescription>
            <span className="font-semibold">Project Type:</span>{" "}
            <Badge variant="outline" className="text-base font-normal">
              {project.projectType.replace("_", " ")}
            </Badge>
            {" | "}
            <span className="font-semibold">Instance Type:</span>{" "}
            <Badge variant="outline" className="text-base font-normal">
              {project.instanceType}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold mb-1">Status</p>
              {getStatusBadge(project.status.toLowerCase())}
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Deployment URL</p>
              <a
                href={project.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                <Globe className="w-4 h-4 mr-1" />
                {project.deploymentUrl}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Repository</p>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                <GitBranch className="w-4 h-4 mr-1" />
                {project.repoUrl}
              </a>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {(project.status === ProjectStatus.DEPLOYED ||
              project.status === ProjectStatus.DEPLOYING) && (
              <Button variant="outline" onClick={handleStopDeployment}>
                <StopCircle className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
            {project.status === ProjectStatus.STOPPED && (
              <Button variant="default" onClick={handleStart}>
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            <Button variant="outline" onClick={handleRedeployment}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Redeploy
            </Button>
            <Button variant="outline" onClick={handleRollback}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Rollback
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Created on {new Date(project.createdAt).toLocaleString()}
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commit ID</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments &&
                deployments.map((deployment) => (
                  <TableRow
                    key={deployment.id}
                    className={`cursor-pointer hover:bg-muted/50 ${deployment.status === "active" ? "bg-muted/20" : ""}`}
                    onClick={() => router.push(`/deployments/${deployment.id}`)}
                  >
                    <TableCell>{deployment.id}</TableCell>
                    <TableCell>{getStatusBadge(deployment.status)}</TableCell>
                    <TableCell className="font-mono">
                      {deployment.data?.commitId}
                    </TableCell>
                    <TableCell>{deployment.data?.branch}</TableCell>
                    <TableCell>
                      {new Date(deployment.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
