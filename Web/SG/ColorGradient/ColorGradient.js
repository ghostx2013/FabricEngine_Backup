/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

var constructColorGradient = function(domRootID, colorKeyTrackLibraryNode, options){
  
  var keyColor = FABRIC.rgb(.0, .0, .0);
  
  options = options ? options : {};
  var draggable = options.draggable!=undefined ? options.draggable : true;
  var zoomable = options.zoomable!=undefined ? options.zoomable : true;
  var timeRange = options.timeRange!=undefined ? options.timeRange : new FABRIC.RT.Vec2(0, 1);
  var trackId =  options.trackId!=undefined ? options.trackId : 0;
  
  var rootDomNode = document.getElementById(domRootID);
  var windowWidth = rootDomNode.clientWidth;
  var windowHeight = rootDomNode.clientHeight;
  
  var svgRoot = FABRIC.createSVGRootElem(domRootID);
  var gradient = svgRoot.createLinearGradient().id('grad1');
  var gradientRect = svgRoot.createRect().size(windowWidth, windowHeight).attr('fill', "url(#grad1)");
  var graphCenterGroup = svgRoot.createGroup().id('graphCenterGroup').translate(0, windowHeight * 0.5);
  var keysHolderGroup = graphCenterGroup.createGroup().id('keysHolderGroup');

  gradientRect.attr('stroke', "black");
  gradientRect.attr('stroke-width', 2);

  var trackData = colorKeyTrackLibraryNode.getTrack(trackId);
  var selectedKeyIndex = -1;
  var gradientKeys = [];
  var addKey = function(index, param, color){
    var gradientKey = gradient.addKey(param, color);
    var keyGroupNode = keysHolderGroup.createGroup()
      .translate(param * windowWidth, 0)
      .selectable({ multiSelectable: false })
      .addOnSelectCallback(
        function(evt) {
          keyRect.attr('stroke', "white");
          keyRect.attr('stroke-width', 3);
          selectedKeyIndex = index;
          gradientWidget.fireEvent('keyclicked', {
            key: gradientKey,
            keycolor: color
          });
        })
      .addOnDeselectCallback(
        function(evt) {
          keyRect.attr('stroke', "black");
          keyRect.attr('stroke-width', 1);
        })
      .draggable({ mouseButton: 0, axis: 'X', containment:gradientRect })
      .addOnDragCallback(
        function(evt) {
          var time = evt.localPos.x / windowWidth;
          gradientKey.setParam(time);
          trackData.keys[index].time = time;
          colorKeyTrackLibraryNode.setTrack(trackData, trackId);
          gradientWidget.fireEvent('gradientchanged');
        });
    
    var keyRect = keyGroupNode.createRect().translate(-2, 0).size(6, windowHeight * 0.4 ).stroke("black").attr('fill', color.toHex());
    if(index==selectedKeyIndex){
      keyRect.attr('stroke', "white");
      keyRect.attr('stroke-width', 3);
    }
    keyRect.attr('stroke-width', 1);
    var gradientKeySetColor = gradientKey.setColor;
    gradientKey.setColor = function(col){
      gradientKeySetColor(col);
      keyRect.attr('fill', col.toHex());
      trackData.keys[index].value = col;
      colorKeyTrackLibraryNode.setTrack(trackData);
      
      gradientWidget.fireEvent('gradientchanged');
    }
    gradientKeys.push(gradientKey);
  }
  
  
  var displayGradient = function(){
    keysHolderGroup.removeAllChildren();
    gradient.clearKeys();
    gradientKeys = [];
    for(var i=0; i<trackData.keys.length; i++){
      addKey(i, trackData.keys[i].time, trackData.keys[i].value);
    }
  }
  gradientRect.elem.addEventListener('mousedown', function(evt) {
    var newKeyT = evt.offsetX/windowWidth;
    var newKey;
    var insertId = 0;
    for(var i=0; i<trackData.keys.length; i++){
      if(trackData.keys[i].time > newKeyT){
        var newKeyVal;
        if(i>0){
          var interp = (newKeyT - trackData.keys[i-1].time) / (trackData.keys[i].time - trackData.keys[i-1].time);
          newKeyVal = trackData.keys[i-1].value.linearInterpolate(trackData.keys[i].value, interp);
        }else{
          newKeyVal = trackData.keys[i];
        }
        newKey = FABRIC.RT.colorKeyframe(newKeyT, newKeyVal);
        trackData.keys.splice(i, 0, newKey);
        selectedKeyIndex = i;
        break;
      }
    }
    if(i==trackData.keys.length){
      selectedKeyIndex = trackData.keys.length;
      newKey = FABRIC.RT.colorKeyframe(newKeyT, trackData.keys[trackData.keys.length-1].value);
      trackData.keys.push(newKey);
    }
    colorKeyTrackLibraryNode.setTrack(trackData);
    
    displayGradient();
    gradientWidget.fireEvent('keyclicked', {
      key: gradientKeys[selectedKeyIndex],
      keycolor: newKey.value
    });
  });
  
  window.addEventListener('keydown', function(evt) {
    if(evt.keyIdentifier == "U+007F"){
      if(selectedKeyIndex >= 0){
        trackData.keys.splice(selectedKeyIndex, 1);
        colorKeyTrackLibraryNode.setTrack(trackData);
        displayGradient();
        gradientWidget.fireEvent('gradientchanged');
      }
    }
  }, false);
  
  displayGradient();
  
  
  // We store a map of arrays of event listener functions.
  var eventListeners = {};

  var gradientWidget = {
    redraw: function(){
      trackData = colorKeyTrackLibraryNode.getTrack(trackId);
      displayGradient();
    },
    addEventListener: function(type, fn) {
      if (!eventListeners[type]) {
        eventListeners[type] = [];
      }
      eventListeners[type].push(fn);
    },
    removeEventListener: function(type, fn) {
      if (eventListeners[type]) {
        var id = eventListeners[type].indexOf(fn);
        if (id !== -1) {
          eventListeners[type].splice(id, 1);
        }
      }
    },
    fireEvent: function(type, evt) {
      for (i in eventListeners[type]) {
        if (eventListeners[type].hasOwnProperty(i)) {
          eventListeners[type][i].call(this, evt);
        }
      }
    }
  };
  return gradientWidget;  
};
