/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/Math",
               "RT/Color"], function() {



FABRIC.RT.KeyframeTrack = function(name, color, keys) {
  this.name = name ? name : "";
  this.color = color ? color : FABRIC.RT.rgb(1.0, 0.0, 0.0);
  this.keys = keys ? keys : [];
};


FABRIC.RT.KeyframeTrack.prototype = {
  setValue: function(time, value) {
    var numKeys = this.keys.length;
    if (numKeys == 0 || time > this.keys[numKeys - 1].time) {
      this.keys.push(this.newKey(time, value));
    }
    else {
      var keyIndex = -1;
      for (var i = 0; i < numKeys; i++) {
        if (this.keys[i].time >= time) {
          keyIndex = i;
          break;
        }
      }
      if(this.keys[i].time === time){
        this.keys[keyIndex].value = value;
      }
      else{
        this.keys.splice(keyIndex, 0, new this.newKey(time, value));
      }
    }
  },
  moveKey: function(keyIndex, time, value){
    var numKeys = this.keys.length;
    var key = this.keys[keyIndex];
    if((keyIndex > 0 && time < this.keys[keyIndex-1].time) ||
       (keyIndex < numKeys-1 && time > this.keys[keyIndex+1].time)){
      var newkeyIndex = keyIndex;
      while(time < this.keys[newkeyIndex-1].time && newkeyIndex>0){
        newkeyIndex--
      }
      while(time > this.keys[newkeyIndex+1].time && newkeyIndex<numKeys-1){
        newkeyIndex++
      }
      this.keys.splice(keyIndex, 1);
      this.keys.splice(newkeyIndex, 0, key);
      keyIndex = newkeyIndex;
    }
    this.keys[keyIndex].time = time;
    this.keys[keyIndex].value = value;
  }
}


FABRIC.RT.KeyframeTrackSet = function( name ) {
  this.name = name ? name : 'trackAnimationContainer';
  this.timeRange = new FABRIC.RT.Vec2(0,0);
  this.tracks = [];
};

FABRIC.RT.KeyframeTrackSet.prototype = {
  addTrack: function(name, color, bindings){
    this.tracks.push(this.newTrack(name, color));
    bindings.push(this.tracks.length - 1);
  },
  addScalarTrack: function(name, color, trackBindings, varId){
    var binding = [];
    this.addTrack(name, color ? color : FABRIC.RT.Color.yellow, binding);
  //  return binding;
    trackBindings.addScalarBinding(varId, binding);
  },
  addVec3Track: function(name, color, trackBindings, varId){
    var binding = [];
    this.addTrack(name, color ? color : FABRIC.RT.Color.yellow, binding);
  //  return binding;
    trackBindings.addVec3Binding(varId, binding);
  },
  addXfoTrack: function(name, color, storeEulerAngles, trackBindings, varId){
    var binding = [];
    this.addTrack(name+'.tr.x', FABRIC.RT.Color.red, binding);
    this.addTrack(name+'.tr.y', FABRIC.RT.Color.green, binding);
    this.addTrack(name+'.tr.z', FABRIC.RT.Color.blue, binding);
    
    if(storeEulerAngles == true){
      this.addTrack(name+'.euler.x', FABRIC.RT.Color.red, binding);
      this.addTrack(name+'.euler.y', FABRIC.RT.Color.green, binding);
      this.addTrack(name+'.euler.z', FABRIC.RT.Color.blue, binding);
    }
    else{
      this.addTrack(name+'.ori.v.x', FABRIC.RT.Color.red, binding);
      this.addTrack(name+'.ori.v.y', FABRIC.RT.Color.green, binding);
      this.addTrack(name+'.ori.v.z', FABRIC.RT.Color.blue, binding);
      this.addTrack(name+'.ori.w',   FABRIC.RT.Color.cyan, binding);
    }
  //  return binding;
    trackBindings.addXfoBinding(varId, binding);
  },
  setValues: function(time, binding, values) {
    for(var i=0; i<binding.length; i++){
      this.tracks[binding[i]].setValue(time, values[i]);
    }
  },
  setPoseValues: function(time, poseVariables, bindings) {
    for (var i = 0; i < bindings.scalarBindings.length; i++) {
      var binding = bindings.scalarBindings[i];
      if(binding.trackIds.length == 1){
        var val = poseVariables.scalarValues[binding.varId];
        this.tracks[binding.trackIds[0]].setValue(time, val);
      }
    }
    for (var i = 0; i < bindings.quatBindings.length; i++) {
      var binding = bindings.quatBindings[i];
      if(binding.trackIds.length == 3){
        //  Quat to Euler
        console.log("TODO:Euler.setFromQuat");
      //  Euler euler;
      //  euler.setFromQuat(poseVariables.quatValues[binding.varId]);
      //  this.tracks[binding.trackIds[0]].setValue(time, euler.x),
      //  this.tracks[binding.trackIds[1]].setValue(time, euler.y),
      //  this.tracks[binding.trackIds[2]].setValue(time, euler.z)));
      }
      else if(binding.trackIds.length == 4){
        var q = poseVariables.quatValues[i];
        this.tracks[binding.trackIds[0]].setValue(time, q.v.x);
        this.tracks[binding.trackIds[1]].setValue(time, q.v.y);
        this.tracks[binding.trackIds[2]].setValue(time, q.v.z);
        this.tracks[binding.trackIds[3]].setValue(time, q.w );
      }
    }
    
    for (var i = 0; i < bindings.xfoBindings.length; i++) {
      var binding = bindings.xfoBindings[i];
      if(binding.trackIds.length != 7){
        console.log('incorrect binding for Xfo:' + binding);
        continue;
      }
      var xfo = poseVariables.xfoValues[binding.varId];
      
      this.tracks[binding.trackIds[0]].setValue(time, xfo.tr.x);
      this.tracks[binding.trackIds[1]].setValue(time, xfo.tr.y);
      this.tracks[binding.trackIds[2]].setValue(time, xfo.tr.z);
      
      if(binding.trackIds.length == 6){
        //  Quat to Euler
        console.log("TODO:Euler.setFromQuat");
      //  Euler euler;
      //  euler.setFromQuat(xfo.ori);
      //  this.tracks[binding.trackIds[0]].setValue(time, euler.x),
      //  this.tracks[binding.trackIds[1]].setValue(time, euler.y),
      //  this.tracks[binding.trackIds[2]].setValue(time, euler.z)));
      }else if(binding.trackIds.length == 7){
        this.tracks[binding.trackIds[3]].setValue(time, xfo.ori.v.x);
        this.tracks[binding.trackIds[4]].setValue(time, xfo.ori.v.y);
        this.tracks[binding.trackIds[5]].setValue(time, xfo.ori.v.z);
        this.tracks[binding.trackIds[6]].setValue(time, xfo.ori.w);
      }
    }
  }
};

});

