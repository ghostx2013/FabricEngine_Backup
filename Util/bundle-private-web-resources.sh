#!/bin/sh

DATE=$(date '+%Y-%m-%d')

zip -qr private-web-resources-$DATE.zip \
  Web/Apps/Private/BigGuy/Resources \
  Web/Apps/Private/Boston/Models \
  Web/Apps/Private/LightPropagationVolumes/models \
  Web/Apps/Private/LightPropagationVolumes/textures \
  Web/Apps/Private/Monster/Images \
  Web/Apps/Private/Monster/Models \
  Web/Apps/Private/V8Engine/Assets \
  Web/Apps/Private/Lamborghini/Assets \
