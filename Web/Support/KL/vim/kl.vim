" Vim syntax file
" Language:	Fabric Kernel Language (KL)
" Maintainer:	Fabric Engine

if exists("b:current_syntax")
  finish
endif

" Comments
syn keyword klCommentTodo     TODO FIXME XXX TBD contained
syn match   klLineComment     "\/\/.*" contains=@Spell,klCommentTodo
syn region  klComment	        start="/\*"  end="\*/" contains=@Spell,klCommentTodo

" Values
syn region  klStringD	        start=+"+  skip=+\\\\\|\\"+  end=+"\|$+
syn region  klStringS	        start=+'+  skip=+\\\\\|\\'+  end=+'\|$+
syn match   klNumber          /-\?\<\d\+\(\.\d\+\)\?\(e[+-]\?\d\+\)\?\>/
syn match   klNumberHex	      /-\?\<0[xX][0-9a-fA-F]\+\>/
syn keyword klBoolean         true false

" Other
syn keyword klType            Boolean Byte Data Float64 Integer Scalar Size String UnregisteredType
syn keyword klConditional     if else switch
syn keyword klRepeat          for while do
syn keyword klBranch          break continue
syn keyword klStatement       return
syn keyword klIdentifier      this
syn keyword klLabel           case default
syn keyword klReserved        var alias in out io struct const use
syn keyword klFunction        function operator
syn match   klBraces          "[{}\[\]\<\>()]"

command -nargs=+ HiLink hi link <args>

HiLink klComment        Comment
HiLink klLineComment		Comment
HiLink klCommentTodo		Todo

HiLink klStringS		    String
HiLink klStringD		    String
HiLink klNumber         Number
HiLink klNumberHex	    Number
HiLink klBoolean		    Boolean

HiLink klType			      Type
HiLink klConditional		Conditional
HiLink klRepeat		      Repeat
HiLink klBranch		      Conditional
HiLink klStatement		  Statement
HiLink klIdentifier		  Identifier
HiLink klLabel		      Label
HiLink klReserved		    Keyword
HiLink klFunction		    Function
HiLink klBraces		      Function

delcommand HiLink

let b:current_syntax = "kl"

