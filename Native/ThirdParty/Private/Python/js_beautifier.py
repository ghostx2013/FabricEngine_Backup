import sys
import os
import exceptions
import glob

fileTypes = ['.js','.kl','.html']
controls = ['case', 'default', 'do', 'else','for', 'if','while','throw', 'switch', 'catch']
keywords = ['break', 'continue', 'finally', 'return',
            'try', 'var', 'with', 'delete', 'new', 'typeof', 'instanceof', '#include']
functions = ['function', 'operator']
curly = ['{', '}']
brace = ['(', ')']
bracket = ['[', ']']
allbrackets = []
allbrackets.extend(curly)
allbrackets.extend(brace)
allbrackets.extend(bracket)
quotes = ['"', "'"]
whitespace = [' ', '\n']
comment = ['//', '/*', '*/']
semicolon = [';']
comma = [',','.']
unaoperators = ['++', '--', '>>', '<<']
binoperators = ['===', '!==', '<<=', '>>=', '+=', '-=', '/=', '*=', '%=',
                '||', '&&', '>=', '<=', '==', '!=', '^=', '&=', '|=',
                '+', '-', '/', '*', '%', '>', '<', ':', '?', '&', '^', '=', '!']
operators = []
operators.extend(unaoperators)
operators.extend(binoperators)
splitters = []
splitters.extend(comment)
splitters.extend(comma)
splitters.extend(semicolon)
splitters.extend(allbrackets)
splitters.extend(quotes)
splitters.extend(whitespace)
splitters.extend(operators)

TYPE_CONTROL = 0
TYPE_KEYWORD = 1
TYPE_FUNCTION = 2
TYPE_CURLY = 4
TYPE_BRACE = 8
TYPE_BRACKET = 16
TYPE_ALL_BRACKETS = TYPE_CURLY | TYPE_BRACE | TYPE_BRACKET
TYPE_QUOTE = 32
TYPE_WHITESPACE = 64
TYPE_COMMENT = 128
TYPE_NO_CODE = TYPE_WHITESPACE | TYPE_COMMENT
TYPE_SEMICOLON = 256
TYPE_COMMA = 512
TYPE_BINOPERATOR = 1024
TYPE_UNAOPERATOR = 2048
TYPE_OPERATOR = TYPE_BINOPERATOR | TYPE_UNAOPERATOR
TYPE_IDENTIFIER = 4096

class token():
  
  string = ''
  type = ''
  index = -1
  def __init__(self,string,type = TYPE_IDENTIFIER,index = 0):
    self.string = string
    self.type = type
    self.index = index
  def isTypeOf(self,type):
    return self.type  

def tokenize(content):

  # first some basic formatting
  content = content.replace('\t','  ')
    
  # get all of the words
  words = []
  while len(content) > 0:
    minSplitIndex = len(content)
    minSplitter = ''
    for i in range(len(splitters)):
      split = content.partition(splitters[i])
      if len(split[1]) > 0:
        if len(split[0]) < minSplitIndex:
          minSplitIndex = len(split[0])
          minSplitter = splitters[i]
          
    if minSplitIndex == len(content):
      words.append(content)
      content = ''
    else:
      split = content.partition(minSplitter)
      if len(split[0]) > 0:
        words.append(split[0])
      words.append(split[1])
      content = split[2]
      
  # parse the words to tokens
  tokens = []
  for word in words:
    tokenIdentified = False
    if not tokenIdentified:
      for i in range(len(controls)):
        if(word == controls[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_CONTROL,i))
          break
    if not tokenIdentified:
      for i in range(len(keywords)):
        if(word == keywords[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_KEYWORD,i))
          break
    if not tokenIdentified:
      for i in range(len(functions)):
        if(word == functions[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_FUNCTION,i))
          break
    if not tokenIdentified:
      for i in range(len(curly)):
        if(word == curly[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_CURLY,i))
          break
    if not tokenIdentified:
      for i in range(len(brace)):
        if(word == brace[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_BRACE,i))
          break
    if not tokenIdentified:
      for i in range(len(bracket)):
        if(word == bracket[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_BRACKET,i))
          break
    if not tokenIdentified:
      for i in range(len(quotes)):
        if(word == quotes[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_QUOTE,i))
          break
    if not tokenIdentified:
      for i in range(len(whitespace)):
        if(word == whitespace[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_WHITESPACE,i))
          break
    if not tokenIdentified:
      for i in range(len(comment)):
        if(word == comment[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_COMMENT,i))
          break
    if not tokenIdentified:
      for i in range(len(semicolon)):
        if(word == semicolon[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_SEMICOLON,i))
          break
    if not tokenIdentified:
      for i in range(len(comma)):
        if(word == comma[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_COMMA,i))
          break
    if not tokenIdentified:
      for i in range(len(binoperators)):
        if(word == binoperators[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_BINOPERATOR,i))
          break
    if not tokenIdentified:
      for i in range(len(unaoperators)):
        if(word == unaoperators[i]):
          tokenIdentified = True
          tokens.append(token(word,TYPE_UNAOPERATOR,i))
          break
    if not tokenIdentified:
      tokenIdentified = True
      tokens.append(token(word,TYPE_IDENTIFIER,0))

  # now since we know the tokens, let's simply some of them
  # simplify the comment tokens into single tokens
  newTokens = []
  lastToken = False
  for i in range(len(tokens)):
    if(lastToken):
      if(lastToken.index == 0):
        if(tokens[i].type == TYPE_WHITESPACE and tokens[i].index == 1):
          newTokens.append(lastToken)
          newTokens.append(tokens[i])
          lastToken = False
        else:
          lastToken.string += tokens[i].string;
      elif(lastToken.index == 1):
        lastToken.string += tokens[i].string;
        if(tokens[i].type == TYPE_COMMENT and tokens[i].index == 2):
          newTokens.append(lastToken)
          lastToken = False
    elif(tokens[i].type == TYPE_COMMENT):
      lastToken = tokens[i]
    else:
      newTokens.append(tokens[i])
  if(lastToken):
    newTokens.append(lastToken)
  tokens = newTokens

  # simplify the string tokens into single tokens
  newTokens = []
  lastToken = False
  for i in range(len(tokens)):
    if(lastToken):
      if(tokens[i].type == TYPE_QUOTE):
        if(tokens[i].index == lastToken.index):
          lastToken.string += "'"
          newTokens.append(lastToken)
          lastToken = False
        else:
          lastToken.string += '"'
          
      else:
        lastToken.string += tokens[i].string
    elif(tokens[i].type == TYPE_QUOTE):
      lastToken = tokens[i]
      lastToken.string = "'" # prefer singles
    else:
      newTokens.append(tokens[i])
  if(lastToken):
    newTokens.append(lastToken)
  tokens = newTokens

  # simplify the numeric tokens into single tokens
  newTokens = []
  lastToken = False
  for i in range(len(tokens)-1):
    if(lastToken):
      if(tokens[i].type == TYPE_IDENTIFIER):
        if(tokens[i].string == 'e' and lastToken.string.find('e') == -1):
          lastToken.string += tokens[i].string;
        else:
          try:
            intvalue = int(tokens[i].string[0:1])
            lastToken.string += tokens[i].string;
          except Exception:
            newTokens.append(lastToken)
            newTokens.append(tokens[i])
            lastToken = False
      elif(tokens[i].type == TYPE_COMMA and tokens[i].index == 1 and lastToken.string.endswith('e')):
        lastToken.string += tokens[i].string;
      elif(tokens[i].type == TYPE_BINOPERATOR and tokens[i].string == '-' and tokens[i+1].type == TYPE_IDENTIFIER):
        try:
          intvalue = int(tokens[i+1].string[0:1])
          lastToken.string += tokens[i].string;
        except Exception:
          newTokens.append(lastToken)
          newTokens.append(tokens[i])
          lastToken = False
      else:
        newTokens.append(lastToken)
        newTokens.append(tokens[i])
        lastToken = False
    elif(tokens[i].type == TYPE_IDENTIFIER):
      try:
        intvalue = int(tokens[i].string[0:1])
        lastToken = tokens[i]
      except Exception:
        newTokens.append(tokens[i])
    else:
      newTokens.append(tokens[i])
  if(lastToken):
    newTokens.append(lastToken)
  newTokens.append(tokens[len(tokens)-1])
  tokens = newTokens

  # simplify the regex tokens into single tokens
  newTokens = []
  startIndex = -1
  endIndex = -1
  string = ''
  i = 0
  while(i < len(tokens)):
    if(startIndex > -1):
      tkn = tokens[i];
      if(not string.endswith("\\") and (
         (tkn.type == TYPE_SEMICOLON) or
         (tkn.type == TYPE_BRACE and tkn.index == 1) or
         (tkn.type == TYPE_WHITESPACE and tkn == 0)
        )):
        if(endIndex > -1):
          string = ''
          for j in range(startIndex,endIndex+1):
            string += tokens[j].string
          newTokens.append(token(string))
          i = endIndex
        else:
          i = startIndex
          newTokens.append(tokens[i])

        startIndex = -1
        endIndex = -1
        string = ''
      elif(tkn.type == TYPE_BINOPERATOR and tkn.string == '/'):
        endIndex = i
        string += tkn.string
      else:
        string += tkn.string
    elif(i > 0 and tokens[i].type == TYPE_BINOPERATOR and tokens[i].string == '/'):
      # check if the previous is not an identifier, not an operator
      j = i-1
      prev = tokens[j]
      while(prev.type == TYPE_WHITESPACE and j > 0):
        j -= 1
        prev = tokens[j]
        
      if((prev.type == TYPE_BINOPERATOR and prev.string == '=') or
         (prev.type == TYPE_BRACE and prev.index == 0) or
         (prev.type == TYPE_COMMA and prev_index == 0)):
        startIndex = i
        string = tokens[i].string
      else:
        newTokens.append(tokens[i])
    else:
      newTokens.append(tokens[i])
    i+=1
  tokens = newTokens

  # now let's simplify the whitespace tokens into single ones
  newTokens = []
  lastToken = False
  for i in range(len(tokens)):
    if(lastToken):
      if(lastToken.index == 0):
        if(tokens[i].type == TYPE_WHITESPACE):
          if(tokens[i].index == 1):
            lastToken = tokens[i]
        else:
          newTokens.append(tokens[i])
          lastToken = False
      elif(lastToken.index == 1):
        if(tokens[i].type == TYPE_WHITESPACE):
          if(tokens[i].index == 1):
            if(len(lastToken.string) < 2):
              lastToken.string += tokens[i].string
        else:
          newTokens.append(lastToken)
          newTokens.append(tokens[i])
          lastToken = False
    elif(tokens[i].type == TYPE_WHITESPACE):
      lastToken = tokens[i]
    else:
      newTokens.append(tokens[i])
  if(lastToken):
    newTokens.append(lastToken)
  tokens = newTokens

  # now let's switch curly and newline tokens
  for i in range(len(tokens)-1):
    if(tokens[i].type == TYPE_WHITESPACE):
      if(tokens[i+1].type == TYPE_CURLY and tokens[i+1].index == 0):
        if(i < len(tokens)-2):
          if(tokens[i+2].type == TYPE_WHITESPACE):
            tokens.remove(tokens[i+2])
        if(i == 0 or tokens[i-1].type != TYPE_COMMENT):
          tmp = tokens[i]
          tokens[i] = tokens[i+1]
          tokens[i+1] = tmp
    elif(tokens[i].type == TYPE_CURLY and tokens[i].index == 0):
      if(tokens[i+1].type != TYPE_WHITESPACE and not(tokens[i+1].type == TYPE_CURLY and tokens[i+1].index == 1)):
        tokens.insert(i+1,token('\n',TYPE_WHITESPACE,1))
    elif(tokens[i+1].type == TYPE_CURLY and tokens[i+1].index == 1):
      if(tokens[i].type != TYPE_WHITESPACE and not(tokens[i].type == TYPE_CURLY and tokens[i+1].index == 0)):
        tokens.insert(i+1,token('\n',TYPE_WHITESPACE,1))
    if(i == len(tokens)-2):
      break

  # now let's switch curly and newline tokens
  curlyCount = 0
  braceCount = 0
  for i in range(len(tokens)-1):
    if(tokens[i].type == TYPE_CURLY):
      if(tokens[i].index == 0):
        curlyCount += 1
      else:
        curlyCount -= 1
    elif(tokens[i].type == TYPE_BRACE):
      if(tokens[i].index == 0):
        braceCount += 1
      else:
        braceCount -= 1
    #elif(tokens[i].type == TYPE_COMMA and tokens[i].index == 0):
    #  if(braceCount <= curlyCount):
    #    tokens.insert(i+1,token('\n',TYPE_WHITESPACE,1))

  return tokens

def stringify(tokens, extension = 'js'):
  
  lines = []
  line = []
  
  # loop over all tokens and put them in lines
  for i in range(len(tokens)):
    if(tokens[i].type == TYPE_WHITESPACE):
      if(tokens[i].index == 1):
        lines.append(line)
        if(len(tokens[i].string) > 1):
          lines.append([token('',TYPE_WHITESPACE)])
        line = []
        continue
    line.append(tokens[i])
  if(len(line)>0):
    lines.append(line)
  
  strings = []
  tabs = ''
  globalCurlyCount = 0
  globalBraceCount = 0
  globalBracketCount = 0
  globalQuoteCount = 0
  entryQuote = 0
  history = []

  for j in range(len(lines)):
    line = lines[j]
    curlyCount = 0
    braceCount = 0
    bracketCount = 0
    string = ''
    
    # check if we have a single control line without curly
    prevLine = False
    if(j > 0):
      k = j-1 
      while(k >= 0):
        if(len(lines[k]) > 0 and (len(lines[k]) > 1 or lines[k][0].type != TYPE_WHITESPACE)):
          prevLine = lines[k]
          break
        k -= 1
    
    for i in range(len(line)):
      if(line[i].type == TYPE_CURLY):
        if(line[i].index == 0):
          globalCurlyCount += 1
          curlyCount += 1
        else:
          if(curlyCount == 0):
            string = string[2:100000]
          globalCurlyCount -= 1
          curlyCount -= 1
      if(line[i].type == TYPE_BRACE):
        if(line[i].index == 0):
          globalBraceCount += 1
          braceCount += 1
        else:
          if(braceCount == 0):
            string = string[2:100000]
          globalBraceCount -= 1
          braceCount -= 1
      if(line[i].type == TYPE_BRACKET):
        if(line[i].index == 0):
          globalBracketCount += 1
          bracketCount += 1
        else:
          if(bracketCount == 0):
            string = string[2:100000]
          globalBracketCount -= 1
          bracketCount -= 1
          
    tabCount = curlyCount + braceCount + bracketCount

    tabBefore = True
    if(prevLine):
      if(prevLine[0].type == TYPE_CONTROL and prevLine[0].string != 'case' and prevLine[0].string != 'default'):
        lastToken = prevLine[len(prevLine)-1]
        if(lastToken.type != TYPE_CURLY or lastToken.index > 0):
          string += '  ';
      elif(prevLine[len(prevLine)-1].type == TYPE_BINOPERATOR and tabCount <= 0):
        tabBefore = False
        string += '  ';
    
    if(tabCount < 0 and tabBefore):
      for i in range(abs(tabCount)):
        tabs = tabs[2:10000]

    string += tabs
    if(len(line)>1):
      firstToken = line[0]
      lastToken = line[len(line)-1]
      if(firstToken.index == 1 and (firstToken.type == TYPE_CURLY or firstToken.type == TYPE_BRACE or firstToken.type == TYPE_BRACKET) and
         lastToken.index == 0 and (lastToken.type == TYPE_CURLY or lastToken.type == TYPE_BRACE or lastToken.type == TYPE_BRACKET)):
        string = string[2:10000]
    elif(len(line) == 1 and line[0].type == TYPE_CURLY and line[0].index == 0):
      string = string[2:10000]

    if(tabCount < 0 and not tabBefore):
      for i in range(abs(tabCount)):
        tabs = tabs[2:10000]

    if(tabCount > 0):
      for i in range(tabCount):
        tabs += '  '

    for i in range(0,len(line)):
      
      if(line[i].type == TYPE_BRACE or line[i].type == TYPE_CURLY or line[i].type == TYPE_BRACKET):
        if(line[i].index == 0):
          history.append(line[i].string)
        else:
          if(line[i].type == TYPE_CURLY):
            if(len(history) > 2 and history[len(history)-1] == 'case'):
              tabs = tabs[2:10000]
              string = string[2:10000]
              history.pop()
          if(len(history) > 0):
            history.pop()

      if(line[i].type == TYPE_COMMENT):
        string += line[i].string.strip()
        continue
      if(line[i].type == TYPE_CURLY):
        if(line[i].index == 0 and not string.endswith(' ') and not string.endswith('[') and not string.endswith('(')):
          string += ' '+line[i].string
          continue
      if(line[i].type == TYPE_FUNCTION):
        if(line[i+1].type != TYPE_BRACE and (line[i].string == 'function' or extension == 'kl')):
          string += line[i].string+' '
          continue
      if(line[i].type == TYPE_BINOPERATOR):
        if(line[i].string == '-'):
          if(i==0):
            string += line[i].string
            continue
          if(line[i-1].type != TYPE_IDENTIFIER and line[i-1].index == 0):
            string += line[i].string
            continue
        if(not string.endswith(' ')):
          if line[i].string == ":" :
            if(len(history) > 0):
              if(history[len(history)-1] == '?'):
                string += ' '
                history.pop()
          elif line[i].string == "?":
            history.append('?')
            string += ' '
          elif line[i].string == "!":
            if(not string.endswith('(')):
              string += ' '
          else:
            string += ' '
        string += line[i].string
        if(i < len(line)-1 and line[i].string != '!'):
          string += ' '
        continue
      if(line[i].type == TYPE_COMMA and line[i].index == 0 and i < len(line)-1):
        string += line[i].string+' '
        continue
      if(line[i].type == TYPE_CONTROL):
        if(line[i].string == 'case' or line[i].string == 'default'):
          if(len(history)>0 and history[len(history)-1] == 'case'):
            string = string[2:10000]
          else:
            history.append('case')
            tabs += '  '
        if(i < len(line)-1 and (line[i+1].type == TYPE_BRACE or line[i+1].type == TYPE_CONTROL or line[i+1].type == TYPE_COMMENT or line[i+1].type == TYPE_IDENTIFIER)):
          string += line[i].string+' '
        else:
          string += line[i].string
        continue
      if(line[i].type == TYPE_KEYWORD and (line[i].string == "var" or line[i].string == "#include")):
        string += line[i].string+' '
        continue
      if(line[i].type == TYPE_KEYWORD and line[i].string == "return" and i < len(line)-1 and line[i+1].type != TYPE_SEMICOLON):
        string += line[i].string+' '
        continue
      if(line[i].type == TYPE_IDENTIFIER and len(string) > 0 and not string.endswith(' ') and not string.endswith('.') and not string.endswith('(') and not string.endswith('[') and not string.endswith('{') and not string.endswith('!')):
        if(string.endswith('-') and not string[0:len(string)-1].endswith(' ')):
          string += line[i].string
        else:
          string += ' '+line[i].string
        continue
      if(line[i].type == TYPE_SEMICOLON and i < len(line)-1 and line[i+1].type != TYPE_WHITESPACE):
        string += line[i].string + ' '
        continue

      string += line[i].string
    
    if(len(string.strip())==0):
      strings.append('')
    else:
      strings.append(string)
      
  # now reindent the tabs, based on smallest indent possible
  counts = []
  for string in strings:
    count = 0
    while(string[count*2:count*2+1] == ' '):
      count += 1
    counts.append(count)
    
  def reindent(strings,counts,index):
    if(strings[index] == ''):
      return
    count = counts[index]
    
    while(counts[index+1] == count or strings[index+1] == ''):
      index += 1
      if(index == len(counts)-1):
        return

    if(counts[index+1] > count+1):
      highIndex = index+1
      lowIndex = index+1
      
      # we found a 2 tabbing or higher
      # now let's check if the next lower one is also my count
      while(counts[lowIndex] >= counts[highIndex] or strings[lowIndex] == ''):
        lowIndex += 1
        if(lowIndex == len(counts)-1):
          break
        
      if(counts[lowIndex] <= count):
        # fantastic, we can lower the tabs
        diff = count - counts[highIndex] + 1
        for i in range(highIndex,lowIndex):
          counts[i] += diff
  
  for i in range(len(counts)-1):
    reindent(strings,counts,i)
    
  for i in range(len(counts)):
    count = 0
    while(strings[i][count:count+1] == ' '):
      count += 1
    newCount = counts[i] * 2
    strings[i] = strings[i][(count-newCount):100000]
  
  return '\n'.join(strings)

def parseJSFile(fileName):
  
  # get the content
  content = open(fileName).read()
  tokens = tokenize(content)
  string = stringify(tokens)
  if(not string.endswith('\n')):
    string += '\n'
  open(fileName,'w').write(string)

def parseHTMLFile(fileName):
  
  # get the content
  lines = open(fileName).read().replace('\t','  ').replace('\r\n','\n').replace('\r','\n').split('\n')
  prejscontent = []
  jscontent = []
  postjscontent = []
  insideJS = 0
  for line in lines:
    stripped = line.lower().strip()
    if(insideJS == 0):
      if(stripped.startswith('<')):
        stripped = stripped[1:10000].strip()
      if(stripped.startswith('script') and stripped.find('src')==-1):
        insideJS = 1
      prejscontent.append(line)
    elif(insideJS == 1):
      if(stripped.startswith('<')):
        insideJS = 2
        postjscontent.append(line)
      else:
        jscontent.append(line)
    else:
      postjscontent.append(line)
    
  tokens = tokenize('\n'.join(jscontent))
  string = stringify(tokens)
  string = '\n'.join(prejscontent) + '\n' + string + '\n' + '\n'.join(postjscontent)
  open(fileName,'w').write(string)

def main():

  if(not sys.argv or len(sys.argv) == 0):
    raise(Exception("No files specified!"))
    
  arguments = []
  for arg in sys.argv:
    arguments.append(arg)
    
  if(len(arguments) <= 1):
    print("Run the tool with all paths to beautify!")
    return
  
  files = []
  for arg in arguments:
    if(arg.find('*') != -1):
      matched = glob.glob(arg)
      for match in matched:
        arguments.append(match)
      continue
    for ft in fileTypes:
      if(arg.lower().endswith(ft)):
        if(os.path.exists(arg)):
          files.append(arg)
          break
        else:
          raise(Exception("The file '"+arg+' does not exist!'))
          
  # parse each file
  for i in range(len(files)):
    extension = files[i].lower().rpartition('.')[2]
    if(extension == 'js' or extension == 'kl'):
      parseJSFile(files[i])
    elif(extension == 'html' or extension == 'htm'):
      parseHTMLFile(files[i])
    else:
      raise(Exception("Unsupported file format '"+extension+"'!"))
    print(str(i+1)+" of "+str(len(files))+" : beautified '"+files[i]+"' successfully.")
  
if __name__ == '__main__':
  main()