export function createDockerFile({
  os,
  runCommand,
  buildCommand,
  port,
}: {
  os: string;
  runCommand: string;
  buildCommand?: string;
  port: number;
}) {
  const Entry =
    `CMD [` +
    runCommand
      .split(' ')
      .map((keyWord) => `"${keyWord}"`)
      .join(' , ') +
    `]`;

  return `
FROM ${os}
WORKDIR /app
COPY . .
RUN npm install
${buildCommand && 'RUN ' + buildCommand}
EXPOSE ${port}
${Entry}
`;
}
