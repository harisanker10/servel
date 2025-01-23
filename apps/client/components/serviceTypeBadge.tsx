import { ProjectStatus, ProjectType } from "@servel/common/types";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Cpu,
  Loader2,
  PauseCircle,
  StickyNote,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProject } from "@/actions/projects/getProject";
import { clear } from "console";

export default function ServiceTypeBadge({
  service,
}: {
  service: ProjectType;
}) {
  console.log({ service });
  switch (service) {
    case ProjectType.WEB_SERVICE:
      return (
        <Badge
          variant="secondary"
          className="w-32 flex items-center justify-center"
        >
          <Cpu className="mr-2 w-4" /> Web Service
        </Badge>
      );
    case ProjectType.STATIC_SITE:
      return (
        <Badge
          variant="secondary"
          className="w-32 flex items-center justify-center"
        >
          <StickyNote className="mr-2 w-4" />
          Static Site
        </Badge>
      );

    default:
      return null;
  }
}

export function ProjectStatusBadge({
  projectId,
  defaultStatus,
}: {
  projectId: string;
  defaultStatus?: ProjectType;
}) {
  const variants = {
    DEPLOYED: "success",
    DEPLOYING: "success",
    FAILED: "destructive",
    BUILDING: "warning",
    QUEUED: "warning",
    STOPPED: "warning",
  };

  const [status, setStatus] = useState(defaultStatus || null);

  useEffect(() => {
    const interval = setInterval(() => {
      getProject(projectId).then((project) => {
        if (project?.status) {
          if (status !== project.status) {
            setStatus(project.status);
          }
          if (
            [
              ProjectStatus.FAILED,
              ProjectStatus.DEPLOYED,
              ProjectStatus.STOPPED,
            ].includes(project.status)
          ) {
            clearInterval(interval);
          }
        }
      });
    }, 3000);

    return () => interval && clearInterval(interval);
  }, []);

  const icons = {
    DEPLOYED: <CheckCircle className="mr-2 h-4 w-4 text-success-foreground" />,
    DEPLOYING: (
      <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />
    ),
    FAILED: <XCircle className="mr-2 h-4 w-4 text-destructive-foreground" />,
    BUILDING: <Loader2 className="mr-2 h-4 w-4 animate-spin text-foreground" />,
    QUEUED: <Loader2 className="mr-2 h-4 w-4 animate-spin " />,
    STOPPED: <PauseCircle className="mr-2 h-4 w-4 text-muted-foreground" />,
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return status ? (
    <Badge
      variant={variants[status] || "success"}
      className="flex items-center"
    >
      {icons[status]} {capitalize(status.toLowerCase())}
    </Badge>
  ) : (
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  );
}
