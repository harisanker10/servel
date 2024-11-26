"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllProjects } from "@/actions/deployments/getUserDeployments";
import { useRouter } from "next/navigation";
import ServiceTypeBadge, {
  ProjectStatusBadge,
} from "@/components/serviceTypeBadge";
import { formatDate } from "@/lib/utils/formatDate";

export default function DeploymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deployments, setDeployments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const depls = await getAllProjects();
      console.log({ depls });
      if (depls && depls?.length > 0) {
        setDeployments(depls);
        console.log(depls);
        console.log({ deployments });
      }
    })();
  }, []);

  return (
    <div className="flex  flex-col  mx-auto w-3/4 gap-8 p-6 sm:p-10">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex mb-5 justify-between items-center">
              <CardTitle className="text-xl">Deployments</CardTitle>
              <Button
                variant="outline"
                onClick={() => router.push("/projects/new")}
              >
                New Deployment
              </Button>
            </div>
            <div className="flex-1">
              <Input
                id="search-repos"
                placeholder="Search deployments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((deployment: any) => (
                  <TableRow
                    className="cursor-pointer"
                    key={deployment?.id}
                    onClick={() => {
                      router.push(`/projects/${deployment.id}`);
                    }}
                  >
                    <TableCell className="font-medium">
                      {deployment?.name}
                    </TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={deployment.status} />
                    </TableCell>
                    <TableCell>
                      {deployment.deploymentUrl ? (
                        <a
                          href={deployment.deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {deployment.deploymentUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(deployment.createdAt)}</TableCell>
                    <TableCell>
                      <ServiceTypeBadge service={deployment.projectType} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
