#!/bin/bash
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

git filter-branch -f --prune-empty --index-filter 'git rm -r --cached --ignore-unmatch \
  Native \
  Web/Apps/Private \
  Util \
  Fabric.xcodeproj \
  Makefile \
  README \
  .gitignore \
  index.html' -- --all
git filter-branch -f --prune-empty --index-filter \
  'git ls-files -s | sed "s,Web/\\(.*\\)$,\\1," | GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info && mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"' \
 -- --all
