#!/usr/bin/env sh

cd "$(dirname "$0")"

target=${1:-"http://localhost:8080/"}
outfile="results/ab-result-$(date +%s).txt"

mkdir results 2> /dev/null
ab -k -c 10 -n 1000 $target | tee $outfile
ab -k -c 100 -n 10000 $target | tee -a $outfile
ab -k -c 200 -n 20000 $target | tee -a $outfile
ab -k -c 500 -n 50000 $target | tee -a $outfile
