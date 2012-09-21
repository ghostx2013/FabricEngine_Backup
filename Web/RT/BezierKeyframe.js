/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/KeyframeTrack",
               "RT/KeyframeTrackBindings"], function() {

/**
 * A function to create a bezier key frame object.
 * @constructor
 * @param {number} time The time of the keyframe.
 * @param {number} value The value of the keyframe.
 * @param {number} intan The input tangent of the keyframe.
 * @param {number} outtan The output tangent of the keyframe.
 */
FABRIC.RT.BezierKeyframe = function(time, value, intan, outtan) {
  this.time = typeof time === 'number' ? time : 0;
  this.value = typeof value === 'number' ? value : 0;
  this.intangent = (intan &&
    intan.getType &&
    intan.getType() === 'FABRIC.RT.Vec2') ? intan : new FABRIC.RT.Vec2(-0.333, 0);
  this.outtangent = (outtan &&
    outtan.getType &&
    outtan.getType() === 'FABRIC.RT.Vec2') ? outtan : new FABRIC.RT.Vec2(0.333, 0);
  this.flags = (intan || outtan) ? 1 : 0;
};

FABRIC.RT.BezierKeyframe.prototype = {
  // This method enables an animation evaluator to know what kind of data
  // track full of these data types should evaluate to.
  get valueType() {
    return 'Scalar';
  },
  getType: function() {
    return 'FABRIC.RT.BezierKeyframe';
  },
  toString: function() {
    return 'FABRIC.RT.BezierKeyframe(' + this.time + ',' + this.value + ',' + this.intangent.toString() + ',' + this.outtangent.toString() +')';
  }
};

/**
 * overloaded constructor function for BezierKeyFrame
 * @param {number} value The value of the keyframe.
 * @param {number} time The time of the keyframe.
 * @param {number} intan The input tangent of the keyframe.
 * @param {number} outtan The output tangent of the keyframe.
 * @return {object} The bezier key frame object.
 */

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('BezierKeyframe', {
    members: {
      time: 'Scalar', value: 'Scalar', intangent: 'Vec2', outtangent: 'Vec2', flags: 'Integer'
    },
    constructor: FABRIC.RT.BezierKeyframe,
    klBindings: {
      filename: 'BezierKeyframe.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/BezierKeyframe.kl')
    }
  });
});


if(!FABRIC.RT.KeyframeTrack){
  throw("please include the RT/KeyframeTrack.js file before this one.");
}

FABRIC.RT.BezierKeyframeTrack = function(name, color, keys) {
  this.name = name ? name : "bezierKeyTrack";
  this.color = color ? color : FABRIC.RT.rgb(1.0, 0.0, 0.0);
  this.keys = keys ? keys : [];
};

FABRIC.RT.BezierKeyframeTrack.prototype = {
  __proto__: FABRIC.RT.KeyframeTrack.prototype,
  newKey: function(value, time, intan, outtan) {
    return new FABRIC.RT.BezierKeyframe(value, time, intan, outtan);
  },
  autoTangents: function(keyIndex, autoTangentsLeftandRight){
    if(this.keys[keyIndex].flags !== 0){
      return;
    }
    var numKeys = this.keys.length;
    var intan, outtan, intdelta, outtdelta, inGradient = 0.0, outGradient = 0.0;
    var prevkey, nextkey, key = this.keys[keyIndex];
    if(keyIndex > 0){
      prevkey = this.keys[keyIndex-1];
      intdelta = (key.time - prevkey.time);
      inGradient = (key.value - prevkey.value)/intdelta;
    }
    if(keyIndex < numKeys-1){
      nextkey = this.keys[keyIndex+1];
      outtdelta = (nextkey.time - key.time);
      outGradient = (nextkey.value - key.value)/outtdelta;
    }
    var gradient = 0.0;
    if(Math.sign(inGradient) === Math.sign(outGradient)){
    //  gradient = (Math.abs(inGradient) < Math.abs(outGradient) ? inGradient : outGradient);
      gradient = (inGradient + outGradient) * 0.5;
      if(prevkey){
        if(Math.abs(key.value - prevkey.value) < Math.abs(gradient * intdelta * 0.5)){
          gradient = (key.value - prevkey.value)/(intdelta * 0.5);
        }
      }
      if(nextkey){
        if(Math.abs(nextkey.value - key.value) < Math.abs(gradient * outtdelta * 0.5)){
          gradient = (nextkey.value - key.value)/(outtdelta * 0.5);
        }
      }
    }
    if(prevkey){
      key.intangent.set(intdelta * -0.33, gradient * intdelta * -0.33);
    }
    if(keyIndex < numKeys-1){
      key.outtangent.set(outtdelta * 0.33, gradient * outtdelta * 0.33);
    }
    if(autoTangentsLeftandRight!==false){
      if(keyIndex > 0){
        this.autoTangents(keyIndex-1, false);
      }
      if(keyIndex < numKeys-1){
        this.autoTangents(keyIndex+1, false);
      }
    }
  },
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
        numKeys = this.keys.length;
      }
      this.autoTangents(keyIndex);
    }
  },
  setInTangentValue: function(keyIndex, value, breakHandles) {
    if(keyIndex > 0){
      var deltat = this.keys[keyIndex-1].time - this.keys[keyIndex].time;
      if(value.x < deltat){
        value.x = deltat;
      }
    }
    if(value.x > 0){
      value.x = 0;
    }
    this.keys[keyIndex].intangent = value;
    this.keys[keyIndex].flags = 1;
    if(!breakHandles && keyIndex < this.keys.length-1){
      this.keys[keyIndex].outtangent.y = (value.y / value.x) * this.keys[keyIndex].outtangent.x;
    }
  },
  setOutTangentValue: function(keyIndex, value, breakHandles) {
    if(keyIndex < this.keys.length - 1){
      var deltat = this.keys[keyIndex+1].time - this.keys[keyIndex].time;
      if(value.x > deltat){
        value.x = deltat;
      }
    }
    if(value.x < 0){
      value.x = 0;
    }
    this.keys[keyIndex].outtangent = value;
    this.keys[keyIndex].flags = 1;
    if(!breakHandles && keyIndex < this.keys.length-1){
      this.keys[keyIndex].intangent.y = (value.y / value.x) * this.keys[keyIndex].intangent.x;
    }
  },
  moveKey: function(keyIndex, time, value){
    
    var numKeys = this.keys.length;
    var prevkey, nextkey, key = this.keys[keyIndex];
    var prevKeyOutTan, inTan, outTan, nextKeyInTan;
    if(keyIndex > 0){
      prevkey = this.keys[keyIndex-1];
      var deltat = (key.time - prevkey.time);
      prevKeyOutTan = new FABRIC.RT.Vec2(prevkey.outtangent.x / deltat, prevkey.outtangent.y / prevkey.outtangent.x);
      inTan = new FABRIC.RT.Vec2(key.intangent.x / deltat, key.intangent.y / key.intangent.x);
    }
    if(keyIndex < numKeys-1){
      nextkey = this.keys[keyIndex+1];
      var deltat = (nextkey.time - key.time);
      outTan = new FABRIC.RT.Vec2(key.outtangent.x / deltat, key.intangent.y / key.intangent.x);
      nextKeyInTan = new FABRIC.RT.Vec2(nextkey.intangent.x / deltat, nextkey.intangent.y / nextkey.intangent.x);
    }
    
    this.__proto__.__proto__.moveKey.apply(this, [keyIndex, time, value]);
    
    if(prevkey){
      var deltat = (key.time - prevkey.time);
      prevkey.outtangent.set(prevKeyOutTan.x * deltat, prevKeyOutTan.x * deltat * prevKeyOutTan.y);
      key.intangent.set(inTan.x * deltat, inTan.x * deltat * inTan.y);
    }
    if(nextkey){
      var deltat = (nextkey.time - key.time);
      key.outtangent.set(outTan.x * deltat, outTan.x * deltat * outTan.y);
      nextkey.intangent.set(nextKeyInTan.x * deltat, nextKeyInTan.x * deltat * nextKeyInTan.y);
    }
  }
}

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('BezierKeyframeTrack', {
    members: {
      name: 'String',
      color: 'Color',
      keys: 'BezierKeyframe[]'
    },
    constructor: FABRIC.RT.BezierKeyframeTrack,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE:'Scalar',
          KEYFRAMETYPE: 'BezierKeyframe',
          KEYFRAMEDATADEFAULTVALUE: '0.0'
        })
    }
  });
});

FABRIC.RT.BezierKeyframeTrackSet = function(name) {
  this.name = name ? name : 'bezierKeyTrackSet';
  this.timeRange = new FABRIC.RT.Vec2(0,0);
  this.tracks = [];
};

FABRIC.RT.BezierKeyframeTrackSet.prototype = {
  __proto__: FABRIC.RT.KeyframeTrackSet.prototype,
  newTrack: function(name, color, keys) {
    return new FABRIC.RT.BezierKeyframeTrack(name, color, keys);
  }
}


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('BezierKeyframeTrackSet', {
    members: {
      name: 'String',
      timeRange: 'Vec2',
      tracks: 'BezierKeyframeTrack[]'
    },
    constructor: FABRIC.RT.BezierKeyframeTrackSet,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE:'Scalar',
          KEYFRAMETYPE: 'BezierKeyframe',
          KEYFRAMEDATADEFAULTVALUE: '0.0'
        })
    }
  });
});


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('BezierKeyframeTrackSetBindings', {
    members: {
      scalarBindings: 'KeyframeTrackBinding[]',
      vec3Bindings: 'KeyframeTrackBinding[]',
      quatBindings: 'KeyframeTrackBinding[]',
      xfoBindings: 'KeyframeTrackBinding[]'
    },
    constructor: FABRIC.RT.KeyframeTrackBindings,
    klBindings: {
      filename: 'KeyframeTrackBindings.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrackBindings.kl'), {
          KEYFRAMEDATATYPE:'Scalar',
          KEYFRAMETYPE: 'BezierKeyframe'
        })
    }
  });
});

});
