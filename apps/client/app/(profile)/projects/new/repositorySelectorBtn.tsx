import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getRepositories } from "@/actions/projects/getRepositories";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GitHubIcon from "@/components/icons/github";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BookLock } from "lucide-react";

export function SelectRepoBtn({
  onSelect,
}: {
  onSelect: (repoUrl: string) => void;
}) {
  const [repos, setRepos] = useState<
    { name: string; url: string; isPrivate: boolean }[]
  >([]);
  const [repositoryFetching, setRepositoryFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [repTooltip, setTooltipOpen] = useState();
  console.log({ repos });

  useEffect(() => {
    setRepositoryFetching(true);
    try {
      getRepositories().then((data) => {
        setRepositoryFetching(false);
        return setRepos(data);
      });
    } catch (err) {}
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <GitHubIcon className="w-4 h-4 mr-2" />
          Select
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="my-4 mt-6">
          <input
            type="text"
            placeholder="Search repositories..."
            className="w-full p-2 border rounded outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-[300px] overflow-y-auto">
          <Table>
            <TableBody>
              {filteredRepos.map((repo) => (
                <TableRow
                  key={repo.name}
                  onClick={() => {
                    onSelect(repo.url);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <TableCell className="font-medium cursor-pointer flex justify-between">
                    {repo.name}
                    {repo.isPrivate && (
                      <>
                        <BookLock className="w-4 h-4" />
                      </>
                    )}
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
