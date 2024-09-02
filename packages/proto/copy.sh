#!/bin/sh

apps=$(ls ../../apps/)

for app in $apps;
do
  if [[ $app != "client" ]]; then
    rm -rf "../../apps/$app/proto/"
    mkdir "../../apps/$app/proto"
    cp -r ../proto/*.proto "../../apps/$app/proto"
  fi
done

cp ./types/* ../dto/src/proto/
