export function getReponame(url: string) {
  return url.split('/')[4];
}
