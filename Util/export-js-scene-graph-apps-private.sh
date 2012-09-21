#!/bin/bash
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

git filter-branch -f --prune-empty --index-filter 'git rm -r --cached --ignore-unmatch \
  .gitignore \
  Native \
  Web/LICENSE.TXT \
  Web/README.TXT \
  Web/.gitignore \
  Web/index.html \
  Web/ThirdParty \
  Web/Themes \
  Web/Core \
  Web/SceneGraph \
  Web/Apps/Sample \
  Util \
  Fabric.xcodeproj \
  Makefile \
  README \
  index.html' -- --all
git filter-branch -f --prune-empty --index-filter \
  'git ls-files -s | sed "s,Web/Apps/Private/\\(.*\\)$,\\1," | GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info && mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"' -- --all
