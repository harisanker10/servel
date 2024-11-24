"use client";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, GitBranch, GitCommit, Globe, Play } from "lucide-react";
import {
  Deployment,
  DeploymentStatus,
  DeploymentData,
} from "@servel/common/types";
import { getDeployment } from "@/actions/deployments/getDeployment";
import { useParams, useRouter } from "next/navigation";
import { retryDeployment } from "@/actions/deployments/retryDeployment";

export default function DeploymentView() {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const params = useParams();
  const router = useRouter();
  console.log({ params });

  useEffect(() => {
    // Simulating API call to fetch deployment data
    const fetchDeployment = async () => {
      //@ts-ignore
      const deployment = await getDeployment(params.id);
      console.log({ deployment });
      setDeployment(deployment || null);
    };

    fetchDeployment();
  }, []);

  const handleRetryDeployment = async () => {
    if (deployment?.id) {
      await retryDeployment(deployment?.id);
      router.back();
    }
  };

  if (!deployment) {
    return <div>Loading...</div>;
  }

  const getDeploymentTypeContent = (data: DeploymentData) => {
    if (!data) {
      return;
    }
    if ("imageUrl" in data) {
      return (
        <div className="space-y-2">
          <p>
            <strong>Image URL:</strong> {data.imageUrl}
          </p>
          <p>
            <strong>Port:</strong> {data.port}
          </p>
        </div>
      );
    } else if ("runCommand" in data) {
      return (
        <div className="space-y-2">
          <p>
            <strong>Repository:</strong> {data.repoUrl}
          </p>
          <p>
            <strong>Run Command:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {data.runCommand}
            </code>
          </p>
          <p>
            <strong>Build Command:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {data.buildCommand}
            </code>
          </p>
          <p>
            <strong>Branch:</strong> {data.branch || "N/A"}
          </p>
          <p>
            <strong>Commit ID:</strong> {data.commitId || "N/A"}
          </p>
          <p>
            <strong>Port:</strong> {data.port}
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <p>
            <strong>Repository:</strong> {data.repoUrl}
          </p>
          <p>
            <strong>Output Directory:</strong> {data.outDir}
          </p>
          <p>
            <strong>Build Command:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {data.buildCommand}
            </code>
          </p>
          <p>
            <strong>Branch:</strong> {data.branch || "N/A"}
          </p>
          <p>
            <strong>Commit ID:</strong> {data.commitId || "N/A"}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Deployment Details
          </CardTitle>
          <CardDescription>ID: {deployment.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <Badge
                variant={
                  deployment.status === DeploymentStatus.active
                    ? "success"
                    : deployment.status === DeploymentStatus.starting
                      ? "warning"
                      : "destructive"
                }
              >
                {deployment.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Project ID</h3>
              <p>{deployment.projectId}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Created At</h3>
              <p>{new Date(deployment.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Updated At</h3>
              <p>{new Date(deployment.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList>
              <TabsTrigger value="details">Deployment Details</TabsTrigger>
              <TabsTrigger value="env">Environment Variables</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {getDeploymentTypeContent(deployment.data)}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="env">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  {deployment.env ? (
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      {deployment.env}
                    </pre>
                  ) : (
                    <p>No environment variables set for this deployment.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRetryDeployment}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Deployment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
