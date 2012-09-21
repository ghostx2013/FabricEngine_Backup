/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/Xfo"], function() {

/**
 * Constructor for a bone object.
 * @constructor
 * @param {object} options The contructor's options.
 */
FABRIC.RT.Bone = function(options) {
  if (!options) options = {};

    this.name = options.name ? '' + options.name : 'bone';
  if (options.referencePose && options.referencePose.getType() === 'FABRIC.RT.Xfo') {
    this.referencePose = options.referencePose;
  }
  else {
    this.referencePose = new FABRIC.RT.Xfo();
  }
  if (options.referenceLocalPose && options.referenceLocalPose.getType() === 'FABRIC.RT.Xfo') {
    this.referenceLocalPose = options.referenceLocalPose;
  }
  else {
    this.referenceLocalPose = new FABRIC.RT.Xfo();
  }
  this.length = typeof options.length === 'number' ? parseFloat(options.length) : 0.0;
  this.radius = typeof options.radius === 'number' ? parseFloat(options.radius) : 1.0;
  this.parent = typeof options.parent === 'number' ? parseInt(options.parent) : - 1;
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('Bone', {
    members: {
      name: 'String',
      referencePose: 'Xfo',
      referenceLocalPose: 'Xfo',
      length: 'Scalar',
      radius: 'Scalar',
      parent: 'Integer'
    },
    constructor: FABRIC.RT.Bone
  });
});


});
