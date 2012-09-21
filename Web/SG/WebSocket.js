/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["SG/SceneGraph"], function() {

FABRIC.SceneGraph.registerManagerType('WebSocketManager', {
  briefDesc: 'The WebSocket manager wraps the HTML5 websocket functionality.',
  detailedDesc: 'The WebSocket manager wraps the HTML5 websocket functionality. It provides access to send and message callbacks.',
  optionsDesc: {
  },
  factoryFn: function(options, scene) {
    scene.assignDefaults(options, {
      serverUrl: undefined,
      serverPort: 8123,
      messageCallBacks: undefined,
      contextID: scene.pub.getContextId().substr(0,20).replace(/[^\w\s]/gi, '')
    });

    // check if we have a serverUrl
    if(options.serverUrl == undefined)
      throw('The serverUrl options HAS to be specified.');
    var serverUrl = 'ws://'+options.serverUrl+':'+options.serverPort;
  
    // create the basis of the manager
    var manager = {
      pub: {
        getContextID: function(){
          return options.contextID
        },
      }
    };
    
    // setup the web socket
    var messageCallBacks = {};
    var context = options.contextID;
    var connections = {};
    var conn = undefined;
    var isConnected = false;
    if (window["WebSocket"]) {
      conn = new WebSocket(serverUrl);

      conn.onmessage = function(evt) {
        message = JSON.parse(evt.data);
        if(message.context == undefined)
          return;
        
        // this should never happen,
        // since the server filters contexts already.
        // let's call this 'insanity' check
        if(message.context != context)
          return;
        
        // check if this message contains data
        if(message.data == undefined)
          return;
        
        // check if we have a callback for this
        if(messageCallBacks[message.action]) {
          messageCallBacks[message.action](message);
        }
        else
          console.log('WebSocket: Received unhandled action message "'+message.action+'"');
      };
      
      // send a message with our context
      conn.onopen = function() {
        conn.send(JSON.stringify({
        'action': 'setContext',
        'context': context
        }));
        isConnected = true;
        
        // if we have an on opencallback
        if(options.onOpenCallBack) {
          options.onOpenCallBack();
        }
      }
    } else {
      throw("This browser doesn't support WebSockets natively.");
    }
  
    // take care of all of the sender functions
    manager.pub.sendMessage = function(actionName, data, id)  {
      if(!isConnected)
        return;
      var message = {};
      message.targetID = id == undefined ? '*' : id;
      message.context = context;
      message.action = actionName;
      message.data = data;
      conn.send(JSON.stringify(message));
    };
    
    manager.pub.addMessageCallBack = function(actionName,callBack) {
      if(messageCallBacks[actionName] != undefined)
        throw('messageCallBack "'+actionName+'" already defined.!');
      messageCallBacks[actionName] = callBack;
    };
    
    if(options.messageCallBacks) {
      for(var actionName in options.messageCallBacks)
        manager.pub.addMessageCallBack(name,options.messageCallBacks[name]);
    }

    // setup a storage buffer
    var bufferedData = {};

    // setup write and read for serialization
    manager.pub.getStorage = function(actionName) {
      if(!actionName) actionName = 'storage';
      var storage = {
        buffer: function(data) {
          bufferedData[actionName] = data;
        },
        read: function(callback) {
          callback(bufferedData[actionName]);
        },
        write: function(data) {
          manager.pub.sendMessage(actionName,data);
        },
        log: function(instr) {
          console.log("WebSocket Storage: "+instr);
        }
      };
      return storage;
    }
    
    return manager;
  }
});


});
