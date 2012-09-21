/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/Math",
               "RT/OGLShaderProgram",
               "RT/OGLTexture2D"], function() {

/**
 * Constructor function to create a OGLRenderTargetTextureDesc.
 * @constructor
 * @param {object} the type of texture. E.g. color/depth.
 * @param {object} the texture object used.
 */
FABRIC.RT.OGLRenderTargetTextureDesc = function(type, texture) {
  this.type = type ? type : 0;
  this.texture = texture ? texture : new FABRIC.RT.OGLTexture2D();
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('OGLRenderTargetTextureDesc', {
    members: {
      type: 'Size', texture: 'OGLTexture2D'
    },
    constructor: FABRIC.RT.OGLRenderTargetTextureDesc
  });
});

/**
 * Constructor function to create a OGLRenderTarget object.
 * @constructor
 * @param {width} width of all the texture buffers.
 * @param {height} height of all the texture buffers.
 * @param {textures} an array of texture desc objects.
 * @param {options} optional parameters for initialization.
 */
FABRIC.RT.OGLRenderTarget = function(width, height, textures, options) {
  this.width = width ? width : 0;
  this.height = height ? height : 0;
  this.resolution = 1.0;
  this.textures = textures ? textures : [];
  this.fbo = 0;
  this.prevFbo = 0;
  this.depthBuffer = -1;
  this.hasDepthBufferTexture = false;
  this.numColorBuffers = 0;
  this.clearDepth = true;
  this.clearColorFlag = true;
  this.clearColor = (options && options.clearColor) ? options.clearColor : FABRIC.RT.rgba(0,0,0,0);
  // Here we define some constants that are used to define the type
  // of buffer. We need a way of defining constants in KL.
  this.DEPTH_BUFFER = 1;
  this.COLOR_BUFFER = 2;
};

FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('OGLRenderTarget', {
    members: {
      width: 'Size',
      height: 'Size',
      resolution: 'Scalar',
      textures: 'OGLRenderTargetTextureDesc[]',
      fbo: 'Integer',
      prevFbo: 'Integer',
      depthBuffer: 'Integer',
      hasDepthBufferTexture: 'Boolean',
      numColorBuffers: 'Integer',
      clearDepth: 'Boolean',
      clearColorFlag: 'Boolean',
      clearColor: 'Color'
    },
    constructor: FABRIC.RT.OGLRenderTarget,
    klBindings: {
      filename: 'OGLRenderTarget.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/OGLRenderTarget.kl')
    }
  });
});


FABRIC.RT.oglRenderTarget = function(width, height, textures, options){
  return new FABRIC.RT.OGLRenderTarget(width, height, textures, options);
}


FABRIC.RT.oglDepthRenderTarget = function(size){
  return new FABRIC.RT.OGLRenderTarget(
    size,
    size,
    [
      new FABRIC.RT.OGLRenderTargetTextureDesc(
        1, // DEPTH_BUFFER
        new FABRIC.RT.OGLTexture2D(
          FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
          FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
          FABRIC.SceneGraph.OpenGLConstants.GL_FLOAT)
      ),
      new FABRIC.RT.OGLRenderTargetTextureDesc(
        2, // COLOR_BUFFER
        new FABRIC.RT.OGLTexture2D(
          FABRIC.SceneGraph.OpenGLConstants.GL_RGBA8,
          FABRIC.SceneGraph.OpenGLConstants.GL_RGBA,
          FABRIC.SceneGraph.OpenGLConstants.GL_UNSIGNED_BYTE)
      )
    ]
  )
}




FABRIC.RT.oglPostProcessingRenderTarget = function(options){
  return new FABRIC.RT.OGLRenderTarget(
    0,
    0,
    [
      new FABRIC.RT.OGLRenderTargetTextureDesc(
        1, // DEPTH_BUFFER
        new FABRIC.RT.OGLTexture2D(
          FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
          FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
          FABRIC.SceneGraph.OpenGLConstants.GL_FLOAT)
      ),
      new FABRIC.RT.OGLRenderTargetTextureDesc(
        2, // COLOR_BUFFER
        new FABRIC.RT.OGLTexture2D(
          FABRIC.SceneGraph.OpenGLConstants.GL_RGBA16F_ARB,
          FABRIC.SceneGraph.OpenGLConstants.GL_RGBA,
          FABRIC.SceneGraph.OpenGLConstants.GL_UNSIGNED_BYTE)
      )
    ],
    options
  )
}

});
