#! /bin/sh
cd "./scripts"
rm -rf "./clones"
mkdir "clones"
cd "./clones"

git clone "$GIT_REPO_URL"
ls
cd $(ls)
ls
cp ../../Dockerfile ./
ls
docker build -t harisanker10/"$DEPL_ID" .
docker tag harisanker10/"$DEPL_ID" harisanker10/"$DEPL_ID":latest
docker push harisanker10/"$DEPL_ID":latest
