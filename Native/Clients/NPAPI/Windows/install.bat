echo Installing Fabric Engine Windows plugin
echo Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
md %APPDATA%\Fabric
md %APPDATA%\Fabric\Exts
copy /Y Exts\*.* %APPDATA%\Fabric\Exts
regsvr32 /s npFabricPlugin.dll
echo Installation complete
pause
