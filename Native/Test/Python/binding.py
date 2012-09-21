#
#  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
#

import json
import fabric
F = fabric.createClient()

b = F.DG.createBinding()
print(fabric.stringify(b.getOperator()))
print(fabric.stringify(b.getParameterLayout()))

o = F.DG.createOperator("op")
b.setOperator(o)
print(fabric.stringify(b.getOperator().getName()))

b.setParameterLayout(["self.foo"])
print(fabric.stringify(b.getParameterLayout()))

F.close()

