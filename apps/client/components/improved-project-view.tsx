'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, GitBranch, GitCommit, Globe, Play, RefreshCcw, RotateCcw, StopCircle } from "lucide-react"

export function ImprovedProjectView() {
  const [project, setProject] = useState({
    _id: '673726bc3159410d15bbf6a9',
    name: 'sort-visualizer',
    instanceType: 'TIER_0',
    projectType: 'WEB_SERVICE',
    status: 'DEPLOYED',
    userId: '673725e1579adf50ed91391f',
    createdAt: '2024-11-15T10:47:24.678Z',
    updatedAt: '2024-11-15T10:48:28.381Z',
    deploymentUrl: 'http://673726bc3159410d15bbf6ab.servel.com',
    repoUrl: 'https://github.com/harisanker10/sort-visualizer',
  })

  const [deployments, setDeployments] = useState([
    {
      _id: '673726bc3159410d15bbf6ab',
      status: 'active',
      projectId: '673726bc3159410d15bbf6a9',
      env: null,
      data: {
        commitId: 'a1b2c3d',
        branch: 'main',
        runCommand: 'npx serve ./dist',
        buildCommand: 'npm run build',
        port: 3000
      },
      createdAt: '2024-11-15T10:47:24.687Z',
      updatedAt: '2024-11-15T10:47:24.687Z',
      logs: 'Deployment started...\nBuilding project...\nDeploy successful!'
    },
    {
      _id: '673726bc3159410d15bbf6ac',
      status: 'completed',
      projectId: '673726bc3159410d15bbf6a9',
      env: null,
      data: {
        commitId: 'e4f5g6h',
        branch: 'feature/new-algo',
        runCommand: 'npx serve ./dist',
        buildCommand: 'npm run build',
        port: 3000
      },
      createdAt: '2024-11-14T15:30:00.000Z',
      updatedAt: '2024-11-14T15:35:00.000Z',
      logs: 'Deployment started...\nBuilding project...\nDeploy successful!'
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
          <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
          <CardDescription>Project Overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Project Type</h3>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {project.projectType.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Instance Type</h3>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {project.instanceType}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <Badge variant={project.status === 'DEPLOYED' ? 'success' : 'warning'} className="text-lg px-3 py-1">
                {project.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Repository</h3>
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                {project.repoUrl}
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Deployment URL</h3>
              <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {project.deploymentUrl}
              </a>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleStopDeployment}>
                <StopCircle className="w-4 h-4 mr-2" />
                Stop
              </Button>
              <Button variant="outline" onClick={handleRedeployment}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Redeploy
              </Button>
              <Button variant="outline" onClick={handleRollback}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Rollback
              </Button>
            </div>
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
                <TableHead>Status</TableHead>
                <TableHead>Commit ID</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <Collapsible key={deployment._id} asChild>
                  <TableRow className={deployment.status === 'active' ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                    <TableCell>
                      <Badge variant={deployment.status === 'active' ? 'success' : 'secondary'}>
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{deployment.data.commitId}</TableCell>
                    <TableCell>{deployment.data.branch}</TableCell>
                    <TableCell>{new Date(deployment.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Toggle deployment details</span>
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <CollapsibleContent asChild>
                      <TableCell colSpan={5}>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Build Command</h4>
                              <p className="font-mono bg-muted p-1 rounded">{deployment.data.buildCommand}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Run Command</h4>
                              <p className="font-mono bg-muted p-1 rounded">{deployment.data.runCommand}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Port</h4>
                              <p>{deployment.data.port}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Deployment Logs</h4>
                            <pre className="bg-muted p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                              {deployment.logs}
                            </pre>
                          </div>
                        </div>
                      </TableCell>
                    </CollapsibleContent>
                  </TableRow>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Environment Variables</CardTitle>
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
    </div>
  )
}