'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, GitBranch, GitCommit, Globe, Play, RefreshCcw, RotateCcw, StopCircle } from "lucide-react"

export function ProjectViewComponent() {
  const [project, setProject] = useState({
    _id: '673726bc3159410d15bbf6a9',
    name: 'sort-visualizer',
    instanceType: 'TIER_0',
    projectType: 'WEB_SERVICE',
    status: 'DEPLOYED',
    userId: '673725e1579adf50ed91391f',
    createdAt: '2024-11-15T10:47:24.678Z',
    updatedAt: '2024-11-15T10:48:28.381Z',
    deploymentUrl: 'http://673726bc3159410d15bbf6ab.servel.com'
  })

  const [deployments, setDeployments] = useState([
    {
      _id: '673726bc3159410d15bbf6ab',
      status: 'starting',
      projectId: '673726bc3159410d15bbf6a9',
      env: null,
      data: {
        commitId: '',
        branch: '',
        repoUrl: 'https://github.com/harisanker10/sort-visualizer',
        runCommand: 'npx serve ./dist',
        buildCommand: 'npm run build',
        port: 3000
      },
      createdAt: '2024-11-15T10:47:24.687Z',
      updatedAt: '2024-11-15T10:47:24.687Z'
    }
  ])

  const handleStopDeployment = () => {
    console.log('Stopping deployment')
    // Add logic to stop deployment
  }

  const handleRedeployment = () => {
    console.log('Redeploying')
    // Add logic to redeploy
  }

  const handleRollback = () => {
    console.log('Rolling back deployment')
    // Add logic to rollback deployment
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
          <CardDescription>Project Overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Project Type</p>
              <p>{project.projectType}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Instance Type</p>
              <p>{project.instanceType}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={project.status === 'DEPLOYED' ? 'success' : 'warning'}>
                {project.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Deployment URL</p>
              <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {project.deploymentUrl}
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Created on {new Date(project.createdAt).toLocaleString()}
          </p>
        </CardFooter>
      </Card>

      <Tabs defaultValue="deployments">
        <TabsList>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>
        <TabsContent value="deployments">
          {deployments.map((deployment) => (
            <Card key={deployment._id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Deployment {deployment._id}</CardTitle>
                <CardDescription>
                  Status: {' '}
                  <Badge variant="default">
                    {deployment.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Repository</p>
                    <p className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a href={deployment.data.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {deployment.data.repoUrl}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Branch</p>
                    <p className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      {deployment.data.branch || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Commit ID</p>
                    <p className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4" />
                      {deployment.data.commitId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Port</p>
                    <p>{deployment.data.port}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Build Command</p>
                    <p className="font-mono text-sm bg-muted p-1 rounded">{deployment.data.buildCommand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Run Command</p>
                    <p className="font-mono text-sm bg-muted p-1 rounded">{deployment.data.runCommand}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Deployed on {new Date(deployment.createdAt).toLocaleString()}
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleStopDeployment}>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRedeployment}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Redeploy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRollback}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Rollback
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Sensitive information is hidden</CardDescription>
            </CardHeader>
            <CardContent>
              {deployments[0].env ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(deployments[0].env, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No environment variables set for this project.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
