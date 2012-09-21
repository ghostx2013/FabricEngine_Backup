/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["SG/SceneGraph"], function() {


FABRIC.SceneGraph.registerManagerType('UndoManager', {
  briefDesc: 'The UndoManager manages undos for Fabric applications.',
  detailedDesc: '.',
  parentManagerDesc: '',
  optionsDesc: {
  },
  factoryFn: function(options, scene) {
    options = scene.assignDefaults(options, {
      maxDepth: 100
    });
    
    var maxDepth = maxDepth;
    // History is the set of closeted changes.
    var undoStack = []; redoStack = [];
    var undoInProgress = false;
    var undoRedoing = false;
    var currentUndoTransaction = undefined;
    var undoEnabled = true;
    
    //////////////////////////////////////
    // A change set bundles together a collection of changes
     
    var createTransaction = function(name){
      var actions = [];
      return {
        addTransaction:function(changeItem){
          actions.push( changeItem );
        },
        close: function() {
          for ( i=0; i < actions.length; i++ ){
            if(actions[i].onClose){
              actions[i].onClose();
            }
          }
        },
        undo: function() {
          for ( i=0; i < actions.length; i++ ){
            actions[i].onUndo();
          }
        },
        redo: function() {
          for ( i=0; i < actions.length; i++ ){
            actions[i].onRedo();
          }
        },
        getName: function(){
          return name;
        },
        // Some undo/redo actions contain state that needs to be explicity cleaned up.
        // This occurs only when actions manage the construction/destruction of
        // dependency graph nodes. 
        destroy: function() {
          for ( i=0; i < actions.length; i++ ){
            if(actions[i].destroy){
              actions[i].destroy();
            }
          }
        }
      }
    }
    var clearStack = function(stack){
      for(var i=0;i<stack.length; i++){
        stack[i].destroy();
      }
      stack.length = 0;
    }
    
    var undoManager = {
      pub:{
        openUndoTransaction : function(undoName) {
          if(!undoEnabled) return;
          if(!undoEnabled || undoRedoing){ // commit any undos that are in progress
            this.close();
          }
          currentUndoTransaction = createTransaction(undoName);
          if( undoStack.length > options.maxDepth ){
            undoStack[0].destroy();
            undoStack.shift();
          }
          undoStack.push(currentUndoTransaction);
          clearStack(redoStack);// Redos get trashed when a new undo is added.
          undoInProgress = true;
        },
        addTransaction: function( action ) {
          if(!undoEnabled || undoRedoing) return;
          var newTransaction = false;
          if( currentUndoTransaction === undefined ){
            this.openUndoTransaction( action.name || "Undo" );
            newTransaction = true;
          }
          currentUndoTransaction.addTransaction( action );
          if( newTransaction ){
            this.closeUndoTransaction();
          }
        },
        closeUndoTransaction: function() {
          if(!undoEnabled || undoRedoing) return;
          if(!undoInProgress ){
            console.warn("Undo Transaction not open.");
            return;
          }
          currentUndoTransaction.close();
          currentUndoTransaction = undefined;
          undoInProgress = false;
          
          undoManager.pub.fireEvent('undotransactionclosed');
        },
        // Undo the last change.
        undo: function() {
          if(!undoEnabled) return;
          // Make sure pending changes have been committed.
          if( undoStack.length > 0 ) {
            undoRedoing = true;
            // Take the top diff from the undoStack, apply it, and store its
            // shadow in the redo undoStack.
            var item = undoStack.pop();
            item.undo();
            redoStack.push(item);
            undoRedoing = false;
            undoManager.pub.fireEvent('undo');
          }
        },
        // Redo the last undone change.
        redo: function() {
          if(!undoEnabled) return;
          if( redoStack.length > 0 ) {
            undoRedoing = true;
            // The inverse of undo, basically.
            var item = redoStack.pop();
            item.redo();
            undoStack.push(item);
            undoRedoing = false;
            undoManager.pub.fireEvent('redo');
          }
        },
        disableUndo: function(){
          undoEnabled = false;
        },
        enableUndo: function(){
          undoEnabled = true;
        },
        undoInprogress: function(){
          return undoInProgress;
        },
        undoTransactionOpen: function(){
          return currentUndoTransaction != undefined;
        },
        undoRedoing: function(){
          return undoRedoing;
        },
        // Update the scene to a particular state in the undo /redo stack.
        updateTo: function( state ) {
          if(!undoEnabled) return;
          if( state > 0 ) { // move into the redo region
            for( i=0;i<state; i++) {
              this.redo();
            }
          }
          else if( state < 0 ) {
            state = -state;
            for( i=0; i<state; i++) {
              this.undo();
            }
          }
        },
        // Ask for the size of the un/redo histories.
        getUndoLevels: function() {
          return undoStack.length;
        },
        getRedoLevels: function() {
          return redoStack.length;
        },
        clearUndoStacks: function() {
          clearStack(undoStack); clearStack(redoStack);
        }
      }
    };
    scene.addEventHandlingFunctions(undoManager);
    
    return undoManager;
  }
});


var createDGNodeMemberChangeUndoAction = function(dgnode, memberName, sliceIndex){
  var newValue, prevValue = dgnode.getData(memberName, sliceIndex);
  return { 
    onClose:function() {
      newValue = dgnode.getData(memberName, sliceIndex);
    },
    onUndo: function() {
      gnode.setData(memberName, sliceIndex, prevValue);
    },
    onRedo: function() {
      gnode.setData(memberName, sliceIndex, newValue);
    }
  }
}

// Note: I am stopping here for now.
// The concept of decommissioning nodes is a good one, but it needs to propagate.
// Maybe what is required throughtout the scene graph is reference counting on
// all 'SceneGraphNodes'. as references are added and removed to thier dgnodes,
// and event handlers, they keep track....
// Ok, so we chould manage all dependencies and event handler relationships in
// the base 'SceneGraphNode' class. This would make it possible to add reference
// counting at this level, and then cause automatic decommisioning of nodes, where
// they cache and disconnect all dependencies.

var createConstructNodeUndoAction = function(scene, type, options){
  var node = scene.constructNode(type, options);
  var decommisioned = false;
  return { 
    onUndo: function() {
      node.decommision();
      decommisioned = true;
    },
    onRedo: function() {
      node.recommision();
      decommisioned = false;
    },
    destroy: function(){
      if(decommisioned){
        node.destroy();
      }
    }
  }
}

var createDestroyNodeUndoAction = function(scene, type, options){
  node.decommision();
  var decommisioned = true;
  return { 
    onUndo: function() {
      node.recommision();
      decommisioned = false;
    },
    onRedo: function() {
      node.decommision();
      decommisioned = false;
    },
    destroy: function(){
      if(decommisioned){
        node.destroy();
      }
    }
  }
}

  
});

