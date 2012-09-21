/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define( function() {
  
/**
 * Constructor for a collected points object.
 * @constructor
 */
FABRIC.RT.CollectedPoints = function() {
  this.points = [];
  this.distances = [];
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('CollectedPoints', {
    members: {
      points: 'Integer[]', distances: 'Scalar[]'
    },
    constructor: FABRIC.RT.CollectedPoints
  });
});

});
