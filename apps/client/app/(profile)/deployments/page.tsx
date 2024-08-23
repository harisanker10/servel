"use client";

import { useState } from "react";
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

export default function DeploymentsPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deployments, setDeployments] = useState([
    {
      id: "dep-1",
      repo: "my-app",
      status: "Deployed",
      url: "https://my-app.vercel.app",
      createdAt: "2023-06-15",
    },
    {
      id: "dep-2",
      repo: "portfolio-site",
      status: "Pending",
      url: null,
      createdAt: "2023-05-30",
    },
    {
      id: "dep-3",
      repo: "blog",
      status: "Failed",
      url: null,
      createdAt: "2023-04-20",
    },
  ]);
  const [repos, setRepos] = useState([
    { id: "repo-1", name: "my-app", lastUpdated: "2023-06-14" },
    { id: "repo-2", name: "portfolio-site", lastUpdated: "2023-05-29" },
    { id: "repo-3", name: "blog", lastUpdated: "2023-04-19" },
    { id: "repo-4", name: "e-commerce", lastUpdated: "2023-03-10" },
    { id: "repo-5", name: "chat-app", lastUpdated: "2023-02-28" },
  ]);
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleDeployRepo = () => {
    console.log("Deploying repo:", repoUrl);
  };


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
                {deployments.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell className="font-medium">
                      {deployment.repo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deployment.status === "Deployed"
                            ? "success"
                            : deployment.status === "Pending"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deployment.url ? (
                        <Link href="#" target="_blank" prefetch={false}>
                          {deployment.url}
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
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex flex-col items-start gap-2 rounded-lg border p-4 shadow-sm"
                >
                  <div className="text-lg font-medium">{repo.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {repo.lastUpdated}
                  </div>
                  <Button variant="outline" size="sm">
                    Deploy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
