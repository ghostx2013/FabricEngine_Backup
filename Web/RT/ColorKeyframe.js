/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/KeyframeTrack"], function() {
  
/**
 * A function to create a linear key frame object.
 * @constructor
 * @param {number} time The time of the keyframe.
 * @param {number} value The value of the keyframe.
 */
FABRIC.RT.ColorKeyframe = function(time, value) {
  this.time = typeof time === 'number' ? time : 0;
  this.value = value != undefined ? value : FABRIC.RT.rgb(1,0,0);
};

FABRIC.RT.ColorKeyframe.prototype = {
  // This method enables an animation evaluator to know what kind of data
  // track full of these data types should evaluate to.
  get valueType() {
    return 'Color';
  },
  getType: function() {
    return 'FABRIC.RT.ColorKeyframe';
  }
};

/**
 * overloaded constructor function for ColorKeyframe
 * @param {number} value The value of the keyframe.
 * @param {number} time The time of the keyframe.
 * @return {object} The linear key frame object.
 */
FABRIC.RT.colorKeyframe = function(time, value) {
  return new FABRIC.RT.ColorKeyframe(time, value);
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('ColorKeyframe', {
    members: {
      time: 'Scalar', value: 'Color'
    },
    constructor: FABRIC.RT.ColorKeyframe,
    klBindings: {
      filename: 'ColorKeyframe.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/ColorKeyframe.kl')
    }
  });
});

if(!FABRIC.RT.KeyframeTrack){
  throw("please include the RT/KeyframeTrack.js file before this one.");
}


FABRIC.RT.ColorKeyframeTrack = function(name, color, keys) {
  this.name = name ? name : "colorKeyTrack";
  this.color = color ? color : FABRIC.RT.rgb(1.0, 0.0, 0.0);
  this.keys = keys ? keys : [];
};

FABRIC.RT.ColorKeyframeTrack.prototype = {
  __proto__: FABRIC.RT.KeyframeTrack.prototype,
  newKey: function(value, time) {
    return new FABRIC.RT.ColorKeyframe(value, time);
  }
}


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('ColorKeyframeTrack', {
    members: {
      name: 'String',
      color: 'Color',
      keys: 'ColorKeyframe[]'
    },
    constructor: FABRIC.RT.KeyframeTrack,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE: 'Color',
          KEYFRAMETYPE: 'ColorKeyframe',
          KEYFRAMEDATADEFAULTVALUE: 'Color(0.0, 0.0, 0.0, 1.0)'
        })
    }
  });
});


FABRIC.RT.ColorKeyframeTrackSet = function(name) {
  this.name = name ? name : 'colorKeyTrackSet';
  this.timeRange = new FABRIC.RT.Vec2(0,0);
  this.tracks = [];
};

FABRIC.RT.ColorKeyframeTrackSet.prototype = {
  __proto__: FABRIC.RT.KeyframeTrackSet.prototype,
  newTrack: function(name, color, keys) {
    return new FABRIC.RT.ColorKeyframeTrack(name, color, keys);
  }
}


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('ColorKeyframeTrackSet', {
    members: {
      name: 'String',
      timeRange: 'Vec2',
      tracks: 'ColorKeyframeTrack[]'
    },
    constructor: FABRIC.RT.KeyframeTrackSet,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE: 'Color',
          KEYFRAMETYPE: 'ColorKeyframe',
          KEYFRAMEDATADEFAULTVALUE: 'Color(0.0, 0.0, 0.0, 1.0)'
        }
      )
    }
  });
});


});
