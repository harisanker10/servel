#!/bin/sh
# Req Envs
# GIT_URL
# DOCKERFILE
# IMAGE_NAME
# ===== optional ===== #
# IMAGE_REGISTRY
# DOCKER_USERNAME
# DOCKER_PASSWORD

set -e

# docker login -u harisanker10 -p Kut10@@9982

# Clone the repository
echo "Cloning repository from $GIT_URL"
git clone $GIT_URL repo
cd repo

# Login to the Docker registry
# echo "Logging in to Docker registry: $DOCKER_REGISTRY"
# docker login $IMAGE_REGISTRY -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

echo "$DOCKERFILE" > Dockerfile


# Build the Docker image
echo "Building Docker image from"
docker build -t $IMAGE_NAME  .


# Push the image to the registry
echo "Pushing image to $IMAGE_NAME"
docker push $IMAGE_NAME
echo "Image successfully pushed to $IMAGE_NAME"

