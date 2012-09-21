@echo off
if "%1" == "" (
  echo "%0 <directory>"
  exit /b 1
)

set ARCHIVE=%1-patch.tar.bz2

echo Creating %ARCHIVE%

if exist %ARCHIVE% del /q %ARCHIVE%

tar.exe -cf - %1 | bzip2 > %ARCHIVE%
rmdir /s/q %1
