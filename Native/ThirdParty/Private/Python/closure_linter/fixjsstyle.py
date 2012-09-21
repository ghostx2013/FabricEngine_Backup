#!/usr/bin/env python
#
# Copyright 2007 The Closure Linter Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Automatically fix simple style guide violations."""

__author__ = 'robbyw@google.com (Robert Walker)'

import sys, os

import gflags as flags
from closure_linter import checker
from closure_linter import error_fixer
from closure_linter.common import simplefileflags as fileflags

FLAGS = flags.FLAGS
flags.DEFINE_list('additional_extensions', None, 'List of additional file '
                  'extensions (not js) that should be treated as '
                  'JavaScript files.')


def main(argv = None):
  """Main function.

  Args:
    argv: Sequence of command line arguments.
  """
  if argv is None:
    argv = flags.FLAGS(sys.argv)

  suffixes = ['.js','.k','.kl','.htm','.html']
  if FLAGS.additional_extensions:
    suffixes += ['.%s' % ext for ext in FLAGS.additional_extensions]

  files = fileflags.GetFileList(argv, 'JavaScript', suffixes)

  style_checker = checker.JavaScriptStyleChecker(error_fixer.ErrorFixer())

  # Check the list of files.
  for filename in files:
    # if we have a js file
    if(filename.endswith('.js') or filename.endswith('.k') or filename.endswith('.kl')):
      style_checker.Check(filename)
    else:
      
      # HM: extract the js code from the html page,
      # run it through the checker, and composite the page again
      lines = open(filename).read().split('\n');
      insidejscode = 0
      htmlprev = []
      htmlpost = []
      jscode = []
      for line in lines:
        stripline = line.strip().lower()
        if(stripline.startswith('<')):
          stripline = stripline[1:10000].strip()
        if(insidejscode == 0):
          htmlprev.append(line)
          if(stripline.startswith('script') and stripline.find('src') == -1):
            insidejscode = 1
        elif(insidejscode == 1):
          if(stripline.startswith('/') and stripline[1:10000].strip().startswith('script')):
            insidejscode = 2
            htmlpost.append(line)
          else:
            jscode.append(line)
        else:
          htmlpost.append(line)
            
      jscode = '\n'.join(jscode)
      open(filename+'.tmp.js','w').write(jscode)
      style_checker.Check(filename+'.tmp.js')
      jscode = open(filename+'.tmp.js').read()
      htmlcode = '\n'.join(htmlprev) + '\n' + jscode + '\n' + '\n'.join(htmlpost)
      open(filename,'w').write(htmlcode)
      os.remove(filename+'.tmp.js')

if __name__ == '__main__':
  main()