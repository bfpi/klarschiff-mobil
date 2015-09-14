#! /usr/bin/env bash

cd `dirname $0`
out=$(grep buildVersion config.json | cut -d ":" -f 2 | cut -d '"' -f 2)
../node_modules/espresso/bin/espresso.js build
if [ $# -ne 0 ]
then
  sed -i 's/<html manifest="cache.manifest">/<html>/' build/$out/index.html
  ln -snf $out build/current
  echo "Build version $out to build/current"
else
  tar czf build/KsMobil-v$out.tar.gz -C build/$out/ .
  echo "Build version $out to build/KsMobil-v$out.tar.gz"
fi
cd -
