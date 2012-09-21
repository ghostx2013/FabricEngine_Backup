#!/bin/sh

OS=$(uname -s)
ARCH=$(uname -m)
TYPE=Release
DATE=$(date '+%Y-%m-%d')

if [ "$OS" = "Windows" ]; then
  ARCHIVE="zip -qr third-party-builds-$OS-$ARCH-$DATE.zip"
  $ARCHIVE Native/ThirdParty/Private/$OS/$ARCH/$TYPE/lib
elif [ "$OS" = "Darwin" ]; then
  ARCHIVE="tar jcf third-party-builds-$OS-universal-$DATE.tar.bz2"
  $ARCHIVE \
    Native/ThirdParty/Private/$OS/i386/$TYPE/lib \
    Native/ThirdParty/Private/$OS/x86_64/$TYPE/lib \
    Native/ThirdParty/Private/$OS/i386/$TYPE/bin \
    Native/ThirdParty/Private/$OS/x86_64/$TYPE/bin
else
  ARCHIVE="tar jcf third-party-builds-$OS-$ARCH-$DATE.tar.bz2"
  $ARCHIVE Native/ThirdParty/Private/$OS/$ARCH/$TYPE/lib
fi
