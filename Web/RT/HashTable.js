/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(function() {

/**
 * Constructor for a hashtable object
 * @constructor
 * @param {number} cellsize The size of a single cell.
 * @param {number} x The x position of the cell.
 * @param {number} y The y position of the cell.
 * @param {number} z The z position of the cell.
 */
FABRIC.RT.HashTable = function(cellsize, x, y, z) {
  this.cells = [];
  this.cellsize = cellsize ? cellsize : 1.0;
  this.x_count = x ? x : 10;
  this.y_count = y ? y : 1;
  this.z_count = z ? z : 10;
};

FABRIC.RT.HashTable.prototype = {
  getType: function() {
    return 'FABRIC.RT.HashTable';
  }
};

/**
 * Overloaded Constructor for a hashtable object
 * @param {number} cellsize The size of a single cell.
 * @param {number} x The x position of the cell.
 * @param {number} y The y position of the cell.
 * @param {number} z The z position of the cell.
 * @return {object} The hashtable object.
 */
FABRIC.RT.hashTable = function(cellsize, x, y, z) {
  return new FABRIC.RT.HashTable(cellsize, x, y, z);
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('HashTable', {
    members: {
      cells: 'Integer[][]', cellsize: 'Scalar', x_count: 'Integer', y_count: 'Integer', z_count: 'Integer'
    },
    constructor: FABRIC.RT.HashTable,
    klBindings: {
      filename: 'HashTable.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/HashTable.kl')
    }
  });
});

});
