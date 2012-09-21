/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/Math", "RT/Vec3", "RT/Quat", "RT/Xfo"], function() {


FABRIC.RT.PoseVariables = function() {
  this.scalarValues = [];
  this.vec3Values = [];
  this.quatValues = [];
  this.xfoValues = [];
};


FABRIC.RT.PoseVariables.prototype = {
  addVariable: function(type, value) {
    var id = -1;
    switch(type){
      case 'Scalar':
        id = this.scalarValues.length;
        this.scalarValues.push( value ? value : 0.0);
        break;
      case 'Vec3':
        id = this.vec3Values.length;
        this.vec3Values.push( value ? value : new FABRIC.RT.Vec3());
        break;
      case 'Quat':
        id = this.quatValues.length;
        this.quatValues.push( value ? value : new FABRIC.RT.Quat());
        break;
      case 'Xfo':
        id = this.xfoValues.length;
        this.xfoValues.push( value ? value : new FABRIC.RT.Xfo());
        break;
      case 'Xfo[]':
        id = [];
        for(var i=0; i<value.length; i++){
          id.push(this.xfoValues.length);
          this.xfoValues.push( value[i] );
        }
        break;
      default:
        throw "unsupported Type:" + type;
    }
    return id;
  },
  setIdentity: function(){
    var i;
    for(i=0; i<this.scalarValues.length; i++){
      this.scalarValues[i] = 0.0;
    }
    for(i=0; i<this.vec3Values.length; i++){
      this.vec3Values[i].set(0.0,0.0,0.0);
    }
    for(i=0; i<this.quatValues.length; i++){
      this.quatValues[i].setIdentity();
    }
    for(i=0; i<this.xfoValues.length; i++){
      this.xfoValues[i].setIdentity();
    }
  }
};


FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('PoseVariables', {
    members: {
      scalarValues: 'Scalar[]',
      vec3Values: 'Vec3[]',
      quatValues: 'Quat[]',
      xfoValues: 'Xfo[]'
    },
    constructor: FABRIC.RT.PoseVariables,
    klBindings: {
      filename: 'PoseVariables.kl',
      sourceCode: FABRIC.preProcessCode(
        FABRIC.loadResourceURL('FABRIC_ROOT/RT/PoseVariables.kl'), {
          KEYFRAMETYPE: 'LinearKeyframe'
        })
    }
  });
});

});
