#!/bin/bash
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

git filter-branch -f --prune-empty --index-filter 'git rm -r --cached --ignore-unmatch \
  Native/ThirdParty/Private \
  Native/Core \
  Native/Tools \
  Native/Clients \
  Native/Exts/Builtin \
  Native/Test \
  Native/Installer \
  Native/DevServer \
  Util \
  Fabric.xcodeproj \
  index.html \
  README' -- --all
