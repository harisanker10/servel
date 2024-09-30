#! /bin/sh
set -e

echo "$GIT_REPO_URL"
echo "$image"
echo "$PWD/scripts"
cd "$PWD/scripts/clones/"

echo "$dockerfile"
ls ../
if [ -d "$GIT_REPO_NAME" ]; then
  echo "deleting repo\n"
  rm -rf "$GIT_REPO_NAME"
fi

git clone "$GIT_REPO_URL"
cd "$GIT_REPO_NAME"

echo "$dockerfile" > Dockerfile

echo "=========="
ls
echo "=========="

docker build -t harisanker10/"$DEPL_ID" .
docker tag harisanker10/"$DEPL_ID":latest "$image"
docker push "$image"
echo "==========end=========================="
