#!/bin/sh
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#

for filename in "$@"
do
  if ! head -4 "$filename" | grep -q 'Copyright 2010-2011 Fabric Technologies Inc\. All rights reserved\.'
  then
    echo "Fixing $filename"
    extension=${filename##*.}
    if [ "$extension" = "js" -o "$extension" = "kl" -o "$extension" = "k" ]; then
      echo '
//
// Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
//
' >"$filename.$$"
    elif [ "$extension" = "cpp" -o "$extension" = "h" -o "$extension" = "cl" -o "$extension" = "css" ]; then
      echo '
/*
 *  Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
 */
' >"$filename.$$"
    elif [ "$extension" = "sh" ]; then
      echo '
#!/bin/sh
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#
' >"$filename.$$"
    elif [ "$extension" = "html" ]; then
      echo \
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
  Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
  -->
' >"$filename.$$"
    else
      echo '
#
# Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
#
' >"$filename.$$"
    fi
    cat "$filename" >>"$filename.$$"
    mv "$filename.$$" "$filename"
  fi
done
