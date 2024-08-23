#!/bin/sh

apps=$(ls ../../apps/)

for app in $apps;
do
  if [[ $app != "client" ]]; then
    rm -rf "../../apps/$app/proto"
    cp -r ../proto "../../apps/$app/proto"
  fi
done
