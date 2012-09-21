/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/KeyframeTrack"], function() {


FABRIC.RT.KeyframeTrackBinding = function(varId, trackIds, param) {
  this.varId = varId != undefined ? varId : -1;
  this.trackIds = trackIds != undefined ? trackIds : [];
  this.param = param != undefined ? param : -1;
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('KeyframeTrackBinding', {
    members: {
      varId: 'Integer',
      trackIds: 'Integer[]',
      param: 'Integer'
    },
    constructor: FABRIC.RT.KeyframeTrackBinding
  });
});


FABRIC.RT.KeyframeTrackBindings = function() {
  this.scalarBindings = [];
  this.vec3Bindings = [];
  this.quatBindings = [];
  this.xfoBindings = [];
};


FABRIC.RT.KeyframeTrackBindings.prototype = {
  addScalarBinding: function(varId, trackId){
    this.scalarBindings.push(new FABRIC.RT.KeyframeTrackBinding(varId, trackId));
  },
  addXfoBinding: function(varId, trackIds, rotationOrder){
    this.xfoBindings.push(new FABRIC.RT.KeyframeTrackBinding(varId, trackIds, rotationOrder));
  },
  setValue: function(trackSetId, time, value, index, characterAnimationContainerNode){
    var type = (typeof value == 'number') ? 'Number' : value.getType();
    var findBinding = function(bindingsList){
      for(var i=0; i<bindingsList.length; i++){
        if(bindingsList[i].varId == index){
          return bindingsList[i];
        }
      }
      throw "Binding not found";
    }
    var binding, values;
    switch(type){
    case 'Number':
      binding = findBinding(this.scalarBindings);
      values = [value];
      break;
    case 'FABRIC.RT.Vec3':
      binding = findBinding(this.vec3Bindings);
      values = [value.x, value.y, value.z];
      break;
    case 'FABRIC.RT.Quat':
      binding = findBinding(this.quatBindings);
      if(binding.trackIds.length == 3){
        var euler = new FABRIC.RT.Euler();
        euler.setFromQuat(value);
        values = [euler.x, euler.y, euler.z];
      }else if(binding.trackIds.length == 4){
        values = [value.w, value.x, value.y, value.z];
      }
      break;
    case 'FABRIC.RT.Xfo':
      binding = findBinding(this.xfoBindings);
      if(binding.trackIds.length == 6){
        var euler = new FABRIC.RT.Euler();
        euler.setFromQuat(value.ori);
        values = [value.tr.x, value.tr.y, value.tr.z, euler.x, euler.y, euler.z];
      }else if(binding.trackIds.length == 7){
        values = [value.tr.x, value.tr.y, value.tr.z, value.ori.v.x, value.ori.v.y, value.ori.v.z, value.ori.w];
      }
      break;
    default:
      throw 'Unhandled type:' + val;
    }
    characterAnimationContainerNode.pub.setValues(trackSetId, time, binding.trackIds, values);
  }
};

/*
FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('KeyframeTrackBindings', {
    members: {
      scalarBindings: 'KeyframeTrackBinding[]',
      vec3Bindings: 'KeyframeTrackBinding[]',
      quatBindings: 'KeyframeTrackBinding[]',
      xfoBindings: 'KeyframeTrackBinding[]'
    },
    constructor: FABRIC.RT.KeyframeTrackBindings,
    klBindings: {
      filename: 'KeyframeTrackBindings.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrackBindings.kl')
    }
  });
});
*/

});
