/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

FABRIC.define(["RT/Math", "RT/OGLShaderProgram"], function() {
  
/**
 * Constructor function to create a Ray object.
 * @constructor
 * @param {object} start A Vec3 defining the start of the ray.
 * @param {object} direction A Vec3 defining the direction of the ray.
 */
FABRIC.RT.OGLTexture2D = function(glInternalFormat, glFormat, glType) {
  this.glInternalFormat = glInternalFormat ? glInternalFormat : 0;
  this.glFormat = glFormat ? glFormat : 0;
  this.glType = glType ? glType : 0;
  this.bufferID = 0;
  this.nbPixels = 0;
  this.textureMinFilter = FABRIC.SceneGraph.OpenGLConstants ? FABRIC.SceneGraph.OpenGLConstants.GL_LINEAR : 0;
  this.textureMaxFilter = FABRIC.SceneGraph.OpenGLConstants ? FABRIC.SceneGraph.OpenGLConstants.GL_LINEAR : 0;
  this.wrapS = FABRIC.SceneGraph.OpenGLConstants ? FABRIC.SceneGraph.OpenGLConstants.GL_REPEAT : 0;
  this.wrapT = FABRIC.SceneGraph.OpenGLConstants ? FABRIC.SceneGraph.OpenGLConstants.GL_REPEAT : 0;
  this.forceRefresh = false;
  this.buildMipmaps = false;
};

FABRIC.RT.oglTexture2D = function(mipmapped){
  var oglTexture = new FABRIC.RT.OGLTexture2D(
    FABRIC.SceneGraph.OpenGLConstants.GL_RGBA8,
    FABRIC.SceneGraph.OpenGLConstants.GL_RGBA,
    FABRIC.SceneGraph.OpenGLConstants.GL_UNSIGNED_BYTE);
  oglTexture.buildMipmaps = true;
  oglTexture.textureMinFilter = FABRIC.SceneGraph.OpenGLConstants.GL_LINEAR_MIPMAP_LINEAR;
  oglTexture.textureMaxFilter = FABRIC.SceneGraph.OpenGLConstants.GL_LINEAR;
  return oglTexture;
}

FABRIC.RT.oglTexture2D_Color = function(){
  return new FABRIC.RT.OGLTexture2D(
    FABRIC.SceneGraph.OpenGLConstants.GL_RGBA32F,
    FABRIC.SceneGraph.OpenGLConstants.GL_RGBA,
    FABRIC.SceneGraph.OpenGLConstants.GL_FLOAT);
}

FABRIC.RT.oglMatrixBuffer2D = function(){
  var oglTexture = new FABRIC.RT.OGLTexture2D();
  oglTexture.glInternalFormat = FABRIC.SceneGraph.OpenGLConstants.GL_RGBA32F;
  oglTexture.glFormat = FABRIC.SceneGraph.OpenGLConstants.GL_RGBA;
  oglTexture.glType = FABRIC.SceneGraph.OpenGLConstants.GL_FLOAT;
  oglTexture.forceRefresh = true;
  oglTexture.textureMinFilter = FABRIC.SceneGraph.OpenGLConstants.GL_NEAREST;
  oglTexture.textureMaxFilter = FABRIC.SceneGraph.OpenGLConstants.GL_NEAREST;
  oglTexture.wrapS = FABRIC.SceneGraph.OpenGLConstants.GL_CLAMP_TO_EDGE;
  oglTexture.wrapT = FABRIC.SceneGraph.OpenGLConstants.GL_CLAMP_TO_EDGE;
  return oglTexture;
}

FABRIC.RT.oglDepthBuffer2D = function(){
  return new FABRIC.RT.OGLTexture2D(
    FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
    FABRIC.SceneGraph.OpenGLConstants.GL_DEPTH_COMPONENT,
    FABRIC.SceneGraph.OpenGLConstants.GL_FLOAT);
}

        
FABRIC.appendOnCreateContextCallback(function(context) {
  context.RegisteredTypesManager.registerType('OGLTexture2D', {
    members: {
     glInternalFormat: 'Integer',
     glFormat: 'Integer',
     glType: 'Integer',
     bufferID: 'Integer',
     nbPixels: 'Size',
     textureMinFilter: 'Integer',
     textureMaxFilter: 'Integer',
     wrapS: 'Integer',
     wrapT: 'Integer',
     forceRefresh: 'Boolean',
     buildMipmaps: 'Boolean'
    },
    constructor: FABRIC.RT.OGLTexture2D,
    klBindings: {
      filename: 'OGLTexture2D.kl',
      sourceCode: FABRIC.loadResourceURL('FABRIC_ROOT/RT/OGLTexture2D.kl')
    }
  });
});

});
