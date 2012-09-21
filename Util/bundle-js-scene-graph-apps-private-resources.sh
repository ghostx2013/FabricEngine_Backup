#!/bin/sh

DATE=$(date '+%Y-%m-%d')

zip -qr js-scene-graph-apps-private-resources-$DATE.zip \
  BigGuy/Resources \
  Boston/Models \
  LightPropagationVolumes/models \
  LightPropagationVolumes/textures \
  Monster/Images \
  Monster/Models \
  V8Engine/Assets \
  Lamborghini/Assets \
