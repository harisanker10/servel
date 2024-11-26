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
  Globe,
  LinkIcon,
  Loader2,
  Play,
  RefreshCcw,
  RotateCcw,
  StopCircle,
} from "lucide-react";
import { getProject } from "@/actions/projects/getProject";
import {
  Deployment,
  DeploymentStatus,
  Project,
  ProjectStatus,
  StaticSiteData,
  WebServiceData,
} from "@servel/common/types";
import { stopProject } from "@/actions/projects/stopProject";
import { retryDeployment } from "@/actions/deployments/retryDeployment";
import UpdateEmailBtn from "../../profile/updateEmailBtn";
import RedeployBtn from "./redeployBtn";
import { getAnalytics } from "@/actions/projects/getAnalytics";
import AnalyticsCard from "@/components/analyticsCard";
import ServiceTypeBadge, {
  ProjectStatusBadge,
} from "@/components/serviceTypeBadge";
import RollbackBtn from "./rollbackBtn";
import { startProject } from "@/actions/projects/startProject";

export default function ProjectView() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [stopLoading, setStopLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>();
  const params = useParams();

  console.log({ analytics });

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
      getAnalytics(project.id).then((data) => setAnalytics(data));
    });
  }, []);
  const handleStopDeployment = async () => {
    if (project?.id) {
      setStopLoading(true);
      await stopProject(project?.id);
      setStopLoading(false);
      router.push("/projects");
    }
  };

  const handleStart = async () => {
    if (project) await startProject(project?.id);
    router.refresh();
  };

  const renderAnalyticsCard = () => {
    if (!analytics || !analytics.requests || analytics.requests.length <= 0) {
      console.log("no analytics.....", analytics);
      return null;
    } else {
      return <AnalyticsCard data={analytics} />;
    }
  };

  if (!project || !project.id) {
    return <Loader2 />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
          <CardDescription className="flex items-center justify-start gap-2 py-2">
            <span className="font-semibold">
              <ServiceTypeBadge service={project.projectType} />
            </span>{" "}
            <Badge variant="secondary" className="h-8 px-4">
              {project.instanceType || "Free Tier"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold mb-1">Status</p>
              <ProjectStatusBadge status={project.status} />
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
                href={
                  deployments &&
                  deployments.length &&
                  deployments[0]?.data?.repoUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                <GitBranch className="w-4 h-4 mr-1" />
                {deployments &&
                  deployments.length &&
                  deployments[0]?.data?.repoUrl}
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Created on {new Date(project.createdAt).toLocaleString()}
          </p>
          <div className="ms-auto flex justify-end space-x-2">
            {(project.status === ProjectStatus.DEPLOYED ||
              project.status === ProjectStatus.DEPLOYING) && (
              <Button variant="destructive" onClick={handleStopDeployment}>
                {stopLoading ? (
                  <Loader2 className="w-4 h-4 mr-2" />
                ) : (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop
                  </>
                )}
              </Button>
            )}
            {
              //   project.status === ProjectStatus.STOPPED && (
              //   <Button variant="default" onClick={handleStart}>
              //     <Play className="w-4 h-4 mr-2" />
              //     Start
              //   </Button>
              // )
            }

            {deployments && <RollbackBtn projectId={project.id} />}

            {deployments && deployments.length > 0 && (
              <RedeployBtn
                projectType={project?.projectType}
                initialValues={{
                  data: {
                    ...deployments[0]?.data,
                  },
                  projectId: project.id,
                }}
              />
            )}
          </div>
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
                    <TableCell>{deployment.status}</TableCell>
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
      {renderAnalyticsCard()}
    </div>
  );
}
