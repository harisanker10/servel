export function getReponame(url: string): string {
  return url?.split('/')[4];
}
