#!/bin/bash
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

git filter-branch -f --prune-empty --index-filter 'git rm -r --cached --ignore-unmatch Web' -- --all
