#!/usr/bin/env sh

cd "$(dirname "$0")"

target=${1:-"http://localhost:8080"}
outfile="results/artillery-result-$(date +%s).json"

mkdir results 2> /dev/null
artillery run --target $target -o "$outfile" artillery-config.yml
artillery report "$outfile" -o "$outfile.html"
open "$outfile.html"
