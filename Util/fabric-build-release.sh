#!/bin/sh
source $FABRIC_CORE_PATH/Util/fabric-build-env.sh Release
scons -C $FABRIC_CORE_PATH -k "$@" 2>&1 \
  | sed -l "s,build/Native/Darwin/universal/Release/Fabric/,$FABRIC_CORE_PATH/Native/,g" \
  | sed -l "s,build/,$FABRIC_CORE_PATH/,g"
