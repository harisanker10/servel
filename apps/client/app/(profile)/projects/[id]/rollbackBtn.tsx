import { getAllDeploymentsOfProject } from "@/actions/deployments/getAllDeploymentsOfProject";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, RefreshCcw, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { CardHeader } from "@/components/ui/card";
import ErrorCard from "@/components/errorCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { rollback } from "@/actions/projects/rollback";

export default function RollbackBtn({ projectId }: { projectId: string }) {
  const [deployments, setDeployments] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getAllDeploymentsOfProject(projectId).then((deployments) =>
      setDeployments(deployments),
    );
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Rollback
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold">Rollback</h1>
        </CardHeader>
        <div className="space-y-4 px-5">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Deployment Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {deployments &&
                deployments.map((deployment) => (
                  <TableRow
                    key={deployment.id}
                    className={`cursor-pointer hover:bg-muted/50 ${deployment.status === "active" ? "bg-muted/20" : ""}`}
                    onClick={async () => {
                      await rollback(deployment.id);
                      setIsOpen(false);
                      router.refresh();
                    }}
                  >
                    <TableCell>{deployment.id}</TableCell>
                    <TableCell>{deployment.status}</TableCell>
                    <TableCell className="font-mono">
                      {deployment.data?.commitId || "N/A"}
                    </TableCell>
                    <TableCell>{deployment.data?.branch || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(deployment.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
