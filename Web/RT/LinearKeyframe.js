/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/KeyframeTrack",
               "RT/KeyframeTrackBindings"], function() {

/**
 * A function to create a linear key frame object.
 * @constructor
 * @param {number} time The time of the keyframe.
 * @param {number} value The value of the keyframe.
 */
FABRIC.RT.LinearKeyframe = function(time, value) {
  this.time = typeof time === 'number' ? time : 0;
  this.value = typeof value === 'number' ? value : 0;
};

FABRIC.RT.LinearKeyframe.prototype = {
  // This method enables an animation evaluator to know what kind of data
  // track full of these data types should evaluate to.
  get valueType() {
    return 'Scalar';
  },
  getType: function() {
    return 'FABRIC.RT.LinearKeyframe';
  }
};

/**
 * overloaded constructor function for LinearKeyframe
 * @param {number} value The value of the keyframe.
 * @param {number} time The time of the keyframe.
 * @return {object} The linear key frame object.
 */

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('LinearKeyframe', {
    members: {
      time: 'Scalar', value: 'Scalar'
    },
    constructor: FABRIC.RT.LinearKeyframe,
    klBindings: {
      filename: 'LinearKeyframe.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/LinearKeyframe.kl')
    }
  });
});

if(!FABRIC.RT.KeyframeTrack){
  throw("please include the RT/KeyframeTrack.js file before this one.");
}

FABRIC.RT.LinearKeyframeTrack = function(name, color, keys) {
  this.name = name ? name : "linearKeyTrack";
  this.color = color ? color : FABRIC.RT.rgb(1.0, 0.0, 0.0);
  this.keys = keys ? keys : [];
};

FABRIC.RT.LinearKeyframeTrack.prototype = {
  __proto__: FABRIC.RT.KeyframeTrack.prototype,
  newKey: function(value, time) {
    return new FABRIC.RT.LinearKeyframe(value, time);
  }
}

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('LinearKeyframeTrack', {
    members: {
      name: 'String',
      color: 'Color',
      keys: 'LinearKeyframe[]'
    },
    constructor: FABRIC.RT.LinearKeyframeTrack,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE:'Scalar',
          KEYFRAMETYPE: 'LinearKeyframe',
          KEYFRAMEDATADEFAULTVALUE: '0.0'
        })
    }
  });
});


FABRIC.RT.LinearKeyframeTrackSet = function(name) {
  this.name = name ? name : 'linearKeyTrackSet';
  this.timeRange = new FABRIC.RT.Vec2(0,0);
  this.tracks = [];
};

FABRIC.RT.LinearKeyframeTrackSet.prototype = {
  __proto__: FABRIC.RT.KeyframeTrackSet.prototype,
  newTrack: function(name, color, keys) {
    return new FABRIC.RT.LinearKeyframeTrack(name, color, keys);
  }
}


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('LinearKeyframeTrackSet', {
    members: {
      name: 'String',
      timeRange: 'Vec2',
      tracks: 'LinearKeyframeTrack[]'
    },
    constructor: FABRIC.RT.LinearKeyframeTrackSet,
    klBindings: {
      filename: 'FABRIC_ROOT/RT/KeyframeTrack.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/KeyframeTrack.kl'), {
          KEYFRAMEDATATYPE: 'Scalar',
          KEYFRAMETYPE: 'LinearKeyframe',
          KEYFRAMEDATADEFAULTVALUE: '0.0'
        }
      )
    }
  });
});


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('LinearKeyframeTrackSetBindings', {
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
          KEYFRAMETYPE: 'LinearKeyframe'
        })
    }
  });
});

});
