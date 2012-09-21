#!/bin/bash
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

git filter-branch -f --prune-empty --index-filter '\
  git rm -r --cached --ignore-unmatch \
    Native/Installer/Chrome/ChromeExtension.pem \
    Native/Installer/Firefox/xpi-update.pem \
    Native/Clients/NPAPI/Windows/afxres.h \
    Native/Clients/NPAPI/Windows/winres.h \
    Native/ThirdParty/Private/uhura.pl \
    Python \
  ' \
  --tag-name-filter cat \
  -- --all
