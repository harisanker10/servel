"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { getLogs } from "@/actions/deployments/getLogs";

interface DeploymentLogViewerProps {
  deploymentId: string;
}

export const DeploymentLogViewer: React.FC<DeploymentLogViewerProps> = ({
  deploymentId,
}) => {
  const [logs, setLogs] = useState({ buildLogs: "", runLogs: "" });
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(async () => {
      setIsFetching(true);
      const logs = await getLogs(deploymentId);
      setIsFetching(false);
      if (logs) {
        setLogs({
          buildLogs: logs["deploymentBuildLog"] as string,
          runLogs: logs["deploymentRunLog"],
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deploymentId]);
  return (
    <div className="w-full mx-auto bg-black rounded-lg shadow-lg overflow-hidden">
      <Tabs defaultValue="build" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-2 bg-gray-800 dark:bg-gray-900`}
        >
          <TabsTrigger
            value="build"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100"
          >
            Build Log
          </TabsTrigger>

          <TabsTrigger
            value="runtime"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100"
          >
            Runtime Log{" "}
            {isFetching && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          <ScrollArea className="h-[600px] w-full">
            <pre className="p-4 text-green-400 text-sm font-mono whitespace-pre-wrap">
              {logs.buildLogs}
            </pre>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="runtime">
          <ScrollArea className="h-[600px] w-full">
            <pre className="p-4 text-blue-400 text-sm font-mono whitespace-pre-wrap">
              {logs.runLogs || "loading..."}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
