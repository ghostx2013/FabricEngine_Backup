echo Uninstalling Fabric Engine Windows plugin
echo Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
rmdir /S /Q %APPDATA%\Fabric
regsvr32 -u /s npFabricPlugin.dll
echo Uninstallation complete
pause
