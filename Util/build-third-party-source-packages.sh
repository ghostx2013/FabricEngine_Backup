#!/bin/sh
DATE=$(date '+%Y-%m-%d')

tar cf third-party-source-packages-$DATE.tar \
  Native/ThirdParty/Private/SourcePackages
