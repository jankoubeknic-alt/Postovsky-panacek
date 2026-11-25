#!/bin/bash
# Projede všechny hratelné obce validátorem a pak headless Chromem.
SP="$(cd "$(dirname "$0")" && pwd)"
cd "$SP/.."
ids=$(awk -F';' 'NR>1 && $4=="ano"{print $1}' data/etapy.csv)
: > $SP/kontrola_over.log
printf '%s\n' $ids | xargs -P 4 -I{} sh -c "echo \"{} \$(timeout 1200 node $SP/over.mjs data/{}/ | tr -s ' \n' ' ')\" >> $SP/kontrola_over.log"
echo HOTOVO >> $SP/kontrola_over.log
args=$(awk -F';' 'NR>1 && $4=="ano"{printf "%s=%s\n",$1,$2}' data/etapy.csv)
IFS=$'\n'; python3 $SP/hraj_obce.py $SP $args > $SP/kontrola_hra.log 2>&1
echo HOTOVO >> $SP/kontrola_hra.log
