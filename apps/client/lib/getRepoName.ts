export function getRepoNameFromUrl(url = ""): string | undefined {
  const githubPattern =
    /^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w-]+)(\.git)?$/;
  const match = url.match(githubPattern);
  if (!match) {
    return undefined;
  }
  const [, , , repo] = match;
  return repo;
}
