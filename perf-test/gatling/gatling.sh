#!/usr/bin/env sh

cd "$(dirname "$0")"

target=${1:-"http://172.20.10.3:8080"}

echo "Testing: $target"

docker run -it --rm \
  -e JAVA_OPTS="-Dhost=$target" \
  -v $PWD/user-files:/opt/gatling/user-files \
  -v $PWD/results:/opt/gatling/results \
  denvazh/gatling:3.0.3 --run-description descr