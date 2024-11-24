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
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0">
        Deployments
      </h1>
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
                      <Badge>{deployment.status}</Badge>
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
                // filteredRepos.map((_o => (
                // <div
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
