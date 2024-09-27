const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the shell script
const scriptPath = path.join(__dirname, './build1.sh');

// Ensure the script file exists
if (!fs.existsSync(scriptPath)) {
  console.error('Script file not found:', scriptPath);
  process.exit(1);
}

// Define the environment variables for the Docker container
const envVars = {
  GIT_REPO_URL: 'https://github.com/harisanker10/sort-visualizer.git',
  IMAGE_NAME: 'harisanker10/elonmasorting',
  BUILD_COMMAND: 'npm run build',
};

// Command to run the Docker container
const process = spawn('docker', [
  'run',
  '--rm',
  '-v',
  `${scriptPath}:/app/build-inside-container.sh`, // Mount the script into the container
  '-e',
  `GIT_REPO_URL=${envVars.GIT_REPO_URL}`,
  '-e',
  `IMAGE_NAME=${envVars.IMAGE_NAME}`,
  '-e',
  `BUILD_COMMAND=${envVars.BUILD_COMMAND}`,
  'node:alpine', // Base image
  '/bin/sh',
  '/app/build-inside-container.sh', // Run the script inside the container
]);

// Handle stdout and stderr
process.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
  if (code === 0) {
    console.log('Shell script executed successfully.');
  } else {
    console.error(`Shell script exited with code ${code}`);
  }
});
