#!/bin/sh

set -e
# Check if environment variables are set
if [ -z "$GIT_REPO_URL" ] || [ -z "$BUILD_COMMAND" ] || [ -z "$IMAGE_NAME" ]; then
  echo "One or more required environment variables are missing (GIT_REPO_URL, BUILD_COMMAND, IMAGE_NAME)"
  exit 1
fi

apk update
apk add docker
apk add git

git clone "$GIT_REPO_URL" /repo

# Navigate to the repository directory
cd /repo || exit

# Run the build command (e.g., npm run build)
npm install
eval "$BUILD_COMMAND"

# Build the Docker image
docker build -t "$IMAGE_NAME" .

echo "Docker image built successfully: $IMAGE_NAME"
