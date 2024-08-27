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
import { getUsersDeployments } from "@/actions/deployments/getUserDeployments";

export default function DeploymentsPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    (async () => {
      const depls = await getUsersDeployments();
      if(depls && depls?.length > 0){
      setDeployments(depls);
      console.log(depls);
      console.log({ deployments });
      }
    })();
  }, []);

  return (
    <div className="flex  flex-col  mx-auto w-3/4 gap-8 p-6 sm:p-10">
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0">
        Deployments
      </h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex mb-5 justify-between items-center">
              <CardTitle className="text-xl">Deployments</CardTitle>
              <Button variant="outline">
                <Link href="/deployments/new"> New Deployment</Link>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((deployment: any) => (
                  <TableRow key={deployment?.id}>
                    <TableCell className="font-medium">
                      {deployment?.repoName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deployment.status === "deployed"
                            ? "success"
                            : deployment.status === "building"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deployment.deploymentUrl ? (
                        <Link href={deployment.deploymentUrl} prefetch={true}>
                          {deployment.deploymentUrl}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{deployment.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex-1 my-5">
              <Input
                id="search-repos"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {
                //   filteredRepos.map((repo) => (
                //   <div
                //     key={repo.id}
                //     className="flex flex-col items-start gap-2 rounded-lg border p-4 shadow-sm"
                //   >
                //     <div className="text-lg font-medium">{repo.name}</div>
                //     <div className="text-sm text-muted-foreground">
                //       Last updated: {repo.lastUpdated}
                //     </div>
                //     <Button variant="outline" size="sm">
                //       Deploy
                //     </Button>
                //   </div>
                // ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
