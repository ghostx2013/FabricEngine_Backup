/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

var constructCurveEditor = function(domRootID, scene, characterAnimationContainerNode, options){
  
  var keyColor = FABRIC.rgb(.0, .0, .0);
  
  options = options ? options : {};
  options.timeStripe = options.timeStripe!=undefined ? options.timeStripe : true;
  options.draggable = options.draggable!=undefined ? options.draggable : true;
  options.zoomable = options.zoomable!=undefined ? options.zoomable : true;
  options.drawKeys = options.drawKeys!=undefined ? options.drawKeys : true; 
  var trackSetId =  options.trackSetId!=undefined ? options.trackSetId : 0;
  var trackFilters = options.trackFilters!=undefined ? options.trackFilters : [];
  var constrainKeysWithinRect = options.constrainKeysWithinRect!=undefined ? options.constrainKeysWithinRect : false;
  
  var timeRange = options.timeRange!=undefined ? options.timeRange : new FABRIC.Vec2(0, 2);
  var valueRange = options.valueRange!=undefined ? options.valueRange : new FABRIC.Vec2(0, 1);
  var fitEditorToKeyRanges = options.fitEditorToKeyRanges!=undefined ? options.fitEditorToKeyRanges : true;
  var displayTrackNames = options.displayTrackNames!=undefined ? options.displayTrackNames : true;
  
  var rootDomNode = document.getElementById(domRootID);
  var windowWidth = rootDomNode.clientWidth;
  var windowHeight = rootDomNode.clientHeight;
  var isBezier = characterAnimationContainerNode.getKeyframeType() == 'BezierKeyframe';
  
  var svgRoot = FABRIC.createSVGRootElem(domRootID);
  svgRoot.attr('id', "curveEditorSVGRoot");
  if(options.volumerenderdemohack){
    svgRoot.attr('style', "position:relative; top:-"+windowHeight+"px;z-index:0");
  }

  var graphBGRect = svgRoot.createRect().size(windowWidth, windowHeight).addClass('EventCatcher');
  var graphCenterGroup = svgRoot.createGroup().id('graphCenterGroup').translate(0, windowHeight * 0.5);
  var curvesHolderGroup = graphCenterGroup.createGroup().id('curvesHolderGroup');
  svgRoot.svgRoot = svgRoot;
  svgRoot.state = 'Normal';
  
  
  var containmentRect;
  if(constrainKeysWithinRect){
    containmentRect = graphCenterGroup.createRect().size(windowWidth, windowHeight).translate(0, windowHeight * -0.5);;
    containmentRect.attr('fill', 'none');
    containmentRect.attr('stroke', "black");
    containmentRect.attr('stroke-width', 2);
  }
  ///////////////
  var tracksData = characterAnimationContainerNode.getTracks(trackSetId);
  var trackCount = tracksData.length;
  var yRange = new FABRIC.Vec2(0, 0);
  var curvesData = [];
  var trackGroups = [];
  var trackDisplayed = [];
  
  trackDisplayNode = scene.getSceneGraphNode(characterAnimationContainerNode.getName()+'TrackDisplay');
  if(!trackDisplayNode){
    trackDisplayNode = scene.constructNode('TrackDisplay', {
      name:characterAnimationContainerNode.getName()+'TrackDisplay',
      characterAnimationContainerNode: characterAnimationContainerNode,
      trackSetId: trackSetId
    });
  }
  else{
    trackDisplayNode.setTrackSetId(trackSetId);
  }
  
  
  var screenXfo = {
    tr: new FABRIC.Vec2(0, 0),
    sc: new FABRIC.Vec2(1, 1),
    fitToScreen:function(){
      if(fitEditorToKeyRanges){
        timeRange = new FABRIC.Vec2(0, 0);
        for (var i = 0; i < trackCount; i++) {
          if(!trackDisplayed[i]) continue;
          var keys = tracksData[i].keys;
          if(keys.length < 2){
            continue;
          }
          if (timeRange.x > keys[0].time) {
            timeRange.x = keys[0].time;
          }
          if (timeRange.y < keys[keys.length - 1].time) {
            timeRange.y = keys[keys.length - 1].time;
          }
        }
        trackDisplayNode.setTimeRange(timeRange);
      }
      var getCurveYRange = function(curveValues) {
        for (var i = 1; i < curveValues.length; i++) {
          if (yRange.x > curveValues[i]) {
            yRange.x = curveValues[i];
          }
          if (yRange.y < curveValues[i]) {
            yRange.y = curveValues[i];
          }
        }
      }
      
      if(!fitEditorToKeyRanges){
        yRange = valueRange;
      }
      else{
        yRange = new FABRIC.Vec2(0, 0);
        for (var i = 0; i < trackCount; i++) {
          if(!trackDisplayed[i]) continue;
          getCurveYRange(trackDisplayNode.getCurveData(i));
        }
      }
      var vscale;
      if(!fitEditorToKeyRanges){
        vscale = -(windowHeight) / (yRange.y - yRange.x);
      }else{
        vscale = -(windowHeight - 40) / (yRange.y - yRange.x);
      }
      
      var hscale = windowWidth;
      if(timeRange.y > timeRange.x){
        hscale = windowWidth/(timeRange.y - timeRange.x);
      }
      this.sc = new FABRIC.Vec2(hscale, vscale);
      this.tr = new FABRIC.Vec2(-timeRange.x, (yRange.y + yRange.x) * -0.5);
    },
    update: function(){
      this.sc.x = windowWidth / (timeRange.y - timeRange.x);
    },
    toScreenSpace: function(val, local){
      if(local){
        return val.multiply(this.sc);
      }else{
        return val.add(this.tr).multiply(this.sc);
      }
    },
    toGraphSpace: function(val, local){
      if(local){
        return val.multiply(this.sc.inverse());
      }else{
        return val.multiply(this.sc.inverse()).subtract(this.tr);
      }
    }
  }
  
  var clearTrackCurves, drawTrackCurves;
  var buildCurveEditor = function(){
    
    if(displayTrackNames){
      ///////////////
      // Build the tree
      var tree = {};
      trackDisplayed = [];
      var currDomElement = $('#keyframeTracks');
      currDomElement.empty();
      for (var i = 0; i < trackCount; i++) {
        var trackData = tracksData[i];
        
        if(!trackGroups[i]){
          trackGroups[i] = curvesHolderGroup.createGroup().id(tracksData[i].name);
        }
        trackDisplayed[i] = true;
        if(trackFilters.length > 0){
          for (var j = 0; j < trackFilters.length; j++) {
            if(trackData.name.indexOf(trackFilters[j])===-1){
              trackDisplayed[i] = false;
            }
          }
          if(!trackDisplayed[i]){
            continue;
          }
        }
        
        var namePath = trackData.name.split('.');
        var currBranch = tree;
        for (var j = 0; j < namePath.length; j++) {
          if(!currBranch[namePath[j]]){
            if(j<(namePath.length-1)){
              currBranch[namePath[j]] = {};
            }else{
              // set the track id as the leaf value
              currBranch[namePath[j]] = i;
            }
          }
          currBranch = currBranch[namePath[j]];
        }
      }
      var trackId = 0;
      var buildTree = function(el, branchName, treedata){
        var li = $(document.createElement('li'));
        var checkbox = $(document.createElement('input')).attr('type', "checkbox");
        li.append(checkbox);
        li.append(branchName);
        el.append(li);
        if(typeof treedata == 'number'){
          checkbox.attr('id', tracksData[trackId].name);
          checkbox.attr('checked', true);
          checkbox.data('displayed', true);
          checkbox.data('trackId', trackId)
          var trackData = tracksData[trackId];
          
          trackId++;
        }else{
          var ul = $(document.createElement('ul'));
          li.append(ul);
          for(var subBranchName in treedata){
            buildTree(ul, subBranchName, treedata[subBranchName]);
          }
        }
      }
      for(var branchName in tree){
        buildTree($('#keyframeTracks'), branchName, tree[branchName]);
      }
    }
    else{
      trackDisplayed.length = trackCount;
      for (var j = 0; j < trackCount; j++) {
        trackDisplayed[j] = true;
        if(!trackGroups[j]){
          trackGroups[j] = curvesHolderGroup.createGroup().id(tracksData[j].name);
        }
      }
    }
  
    if(!fitEditorToKeyRanges){
      yRange = valueRange;
    }
  
    screenXfo.fitToScreen();
  
    var drawTrackCurve = function(trackId) {
      var trackData = tracksData[trackId];
      var trackGroup = trackGroups[trackId];
      trackGroup.removeAllChildren();
      var path = trackGroup.createPath().addClass('CurvePath').stroke(trackData.color);
      var setPathCurveValues = function(curveValues) {
        try{
          var pathValues;
          if(timeRange.y > timeRange.x){
            var val = screenXfo.toScreenSpace(new FABRIC.Vec2(0, curveValues[0]));
            pathValues = ['M', val.x, val.y, 'L'];
            for (var i = 0; i < curveValues.length; i++) {
              var t = ((i/curveValues.length)*(timeRange.y - timeRange.x))+timeRange.x;
              val = screenXfo.toScreenSpace(new FABRIC.Vec2(t, curveValues[i]));
              pathValues[(i * 2) + 4] = val.x;
              pathValues[(i * 2) + 5] = val.y;
            }
          }
          else{
            var val1 = screenXfo.toScreenSpace(new FABRIC.Vec2(0, curveValues[0]));
            var val2 = screenXfo.toScreenSpace(new FABRIC.Vec2(1, curveValues[0]));
            pathValues = ['M', val1.x, val1.y, 'L', val2.x, val2.y];
          }
          path.attr('d', pathValues.join(' '));
        }
        catch(e){
          console.warn("Bug: the core is sometimes returning null values e.g.:"+JSON.stringify(curveValues));
        }
      }
  
      var updateCurve = function() {
        setPathCurveValues(trackDisplayNode.getCurveData(trackId));
      }
      updateCurve();
      
      var updateDrawnKeys = function(){
        for(var i=0; i<trackData.keys.length; i++){
          var key = trackData.keys[i];
          var keySsVal = screenXfo.toScreenSpace(new FABRIC.Vec2(key.time, key.value));
          drawnKeys[i].key.translate(keySsVal);
          if(drawnKeys[i].intan){
            var inTanSsVal = screenXfo.toScreenSpace(key.intangent, true);
            drawnKeys[i].intan.translate(inTanSsVal.x - 3, inTanSsVal.y - 3)
            drawnKeys[i].intanline.attr('d', 'M 0 0 L ' + inTanSsVal.x + ' ' + inTanSsVal.y);
          }
          if(drawnKeys[i].outtan){
            var outTanSsVal = screenXfo.toScreenSpace(key.outtangent, true);
            drawnKeys[i].outtan.translate(outTanSsVal.x - 3, outTanSsVal.y - 3)
            drawnKeys[i].outtanline.attr('d', 'M 0 0 L ' + outTanSsVal.x + ' ' + outTanSsVal.y);
          }
        }
      }
      var drawnKeys = [];
      var drawKey = function(keyIndex, keyData) {
        
        if(isBezier ? ((keyData.time + keyData.intangent.x) < timeRange.y &&
           (keyData.time + keyData.outtangent.x) >= timeRange.x) :
           keyData.time <= timeRange.y && keyData.time >= timeRange.x ){
          ///////////////////////////////////////////////
          // Key
          var keySsVal = screenXfo.toScreenSpace(new FABRIC.Vec2(keyData.time, keyData.value));
          // When keyframes are manipulated, we can maintain the tangent lengths
          // by storing the relative lengths, and gradients. Then, during manipulation
          // we maintain these relative lengths and gradients. This simplifies the
          // keyframes, by moving the complexity into the manipulation system.
          var prevKey = trackData.keys[keyIndex-1],
              nextKey = trackData.keys[keyIndex+1];
          var keyGroupNode = trackGroup.createGroup().translate(keySsVal)
            .draggable({ mouseButton: 0, containment:containmentRect })
            .addOnDragBeginCallback(
              function(evt){
            })
            .addOnDragCallback(
              function(evt) {
                var keyGsVal = screenXfo.toGraphSpace(evt.localPos);
                tracksData[trackId].moveKey(keyIndex, keyGsVal.x, keyGsVal.y);
                characterAnimationContainerNode.setTrack(trackData, trackId, trackSetId);
                updateCurve();
                updateDrawnKeys();
                scene.redrawAllViewports();
              });
          var keyNode = keyGroupNode.createRect().translate(-4, -4).size(8, 8).stroke(keyColor);
          drawnKeys[keyIndex] = { key: keyGroupNode };
          
          if(isBezier) {
            ///////////////////////////////////////////////
            // In Tangent
            var inTanSsVal = screenXfo.toScreenSpace(keyData.intangent, true);
            var inTanLineNode = keyGroupNode.createPath().addClass('KeyframeHandle');
            inTanLineNode.attr('d', 'M 0 0 L ' + inTanSsVal.x + ' ' + inTanSsVal.y);
            var inTanNode = keyGroupNode.createRect()
                                        .translate(inTanSsVal.x - 3, inTanSsVal.y - 3)
                                        .size(6, 6).stroke(keyColor);
            inTanNode.draggable({ mouseButton: 0 })
              .addOnDragCallback(
                function(evt) {
                  var keyInTanGsVal = screenXfo.toGraphSpace(evt.localPos, true);
                  trackData.setInTangentValue(keyIndex, keyInTanGsVal, evt.altKey);
                  characterAnimationContainerNode.setTrack(trackData, trackId, trackSetId);
                  updateCurve();
                  updateDrawnKeys();
                  scene.redrawAllViewports();
                });
            drawnKeys[keyIndex].intan = inTanNode;
            drawnKeys[keyIndex].intanline = inTanLineNode;

            ///////////////////////////////////////////////
            // Out Tangent
            var outTanSsVal = screenXfo.toScreenSpace(keyData.outtangent, true);
            var outTanLineNode = keyGroupNode.createPath().addClass('KeyframeHandle');
            outTanLineNode.attr('d', 'M 0 0 L ' + outTanSsVal.x + ' ' + outTanSsVal.y);
            var outTanNode = keyGroupNode.createRect()
                                          .translate(outTanSsVal.x - 3, outTanSsVal.y - 3)
                                          .size(6, 6).stroke(keyColor);
    
            outTanNode.draggable({ mouseButton: 0 })
              .addOnDragCallback(
                function(evt) {
                  var keyOutTanGsVal = screenXfo.toGraphSpace(evt.localPos, true);
                  trackData.setOutTangentValue(keyIndex, keyOutTanGsVal, evt.altKey);
                  characterAnimationContainerNode.setTrack(trackData, trackId, trackSetId);
                  updateCurve();
                  updateDrawnKeys();
                  scene.redrawAllViewports();
                });
            drawnKeys[keyIndex].outtan = outTanNode;
            drawnKeys[keyIndex].outtanline = outTanLineNode;
          }
        }
      }
      if (options.drawKeys) {
        var trackData = tracksData[trackId];
        for (var i = 0; i < trackData.keys.length; i++) {
          drawKey(i, trackData.keys[i]);
        }
      }
    }
      
    drawTrackCurves = function(){
      for (var i = 0; i < trackCount; i++) {
        if(trackDisplayed[i]){
          drawTrackCurve(i);
        }else if(trackGroups[i]){
          trackGroups[i].removeAllChildren();
        }
      }
    }
    
    clearTrackCurves = function(){
      for (var i = 0; i < trackCount; i++) {
        trackGroups[i].removeAllChildren();
      }
    }
      
    drawTrackCurves();
    
    if(displayTrackNames){
      $('#keyframeTracks').click( function(){
        $(this).find("input[type='checkbox']").each(function(index, el){
          if($(el).attr('id') != undefined){
            var trackId = $(el).data('trackId');
            if(!$(el).is(':checked')){
              // remove the curve from display
              if($(el).data('displayed')){
                trackGroups[trackId].removeAllChildren();
                $(el).data('displayed', false);
              }
            }else{
              if(!$(el).data('displayed')){
                drawTrackCurve(trackId);
                $(el).data('displayed', true);
              }
            }
            trackDisplayed[trackId] = $(el).is(':checked');
          }
        });
      });
    }
    
  }
  buildCurveEditor();
  
  var setCurveFilters = function(filters){
    trackFilters = filters;
    tracksData = characterAnimationContainerNode.getTracks(trackSetId);
    buildCurveEditor();
  }
  
  if(options.timeStripe){
    var timeStripeGroupNode = graphCenterGroup.createGroup()
      .translate((scene.animation.getTime() + screenXfo.tr.x)  * screenXfo.sc.x, windowHeight * -0.5)
      .draggable({ mouseButton: 0, axis: 'X' })
      .addOnDragCallback(
        function(evt) {
          scene.animation.setTime((evt.localPos.x / screenXfo.sc.x) - screenXfo.tr.x);
        });
    var timeStripeEventCatcher = timeStripeGroupNode.createRect().size(10, windowHeight).translate(-5, 0).addClass('EventCatcher');
    var timeStripe = timeStripeGroupNode.createPath().addClass('TimeStripePath')
        .attr('d', 'M 0 0 L 0 ' + windowHeight);
    
    var updateTimeStripe = function(){
      timeStripeGroupNode.translate((scene.animation.getTime() + screenXfo.tr.x)  * screenXfo.sc.x, windowHeight * -0.5);
    }
    var risizeTimeStripe = function(){
      timeStripe.attr('d', 'M 0 0 L 0 ' + windowHeight);
      timeStripeEventCatcher.size(10, windowHeight)
    }
    scene.addEventListener('timechanged', updateTimeStripe);
  }
  
  var updateTimeRange = function(){
    trackDisplayNode.setTimeRange(timeRange);
    curvesData = trackDisplayNode.getCurveData();
    
    if(options.timeStripe){
      updateTimeStripe();
    }
    drawTrackCurves();
  }
  
  var fitCurveEditorToWindow = function(){
    var newWindowWidth = $('#curveViewer').width();
    var newWindowHeight = $('#curveViewer').height();
    
    // Occasionaly when the window is opened, it has a negative width and
    // then we get sent a resize event. Here, we re-fit the curve to the screen.
    var invalidWindowWidth = (windowWidth < 0);
    windowWidth = newWindowWidth;
    windowHeight = newWindowHeight;
    if(invalidWindowWidth){
      screenXfo.fitToScreen();
    }
    graphCenterGroup.translate(0, windowHeight * 0.5);
    graphBGRect.size(windowWidth, windowHeight);
    risizeTimeStripe();
    updateTimeRange();
  }
  
  if(options.draggable){
    var dragStartTimeRange;
    var dragStartOffset;
    graphBGRect.draggable( {mouseButton:0, delegateTranslateObj:false, highlight:false } )
      .addOnDragBeginCallback(
        function(evt){
          dragStartTimeRange = timeRange.clone();
          dragStartOffset = screenXfo.tr.clone();
      })
      .addOnDragCallback(
        function(evt){
          timeRange.x = dragStartTimeRange.x - (evt.dragVec.x / screenXfo.sc.x);
          timeRange.y = dragStartTimeRange.y - (evt.dragVec.x / screenXfo.sc.x);
          screenXfo.tr = dragStartOffset.add(evt.dragVec.multiply(screenXfo.sc.inverse()));
          updateTimeRange();
        });
  }
  
  if(options.zoomable){
    var mouseWheelZoomFn = function(evt) {
      if(evt.detail != undefined) evt.wheelDelta = evt.detail * -50;
      var zoomDist = evt.wheelDelta * 0.5;
      timeRange.x += zoomDist / screenXfo.sc.x;
      timeRange.y -= zoomDist / screenXfo.sc.x;
      yRange.x -= zoomDist / (screenXfo.sc.y * (windowWidth/windowHeight));
      yRange.y += zoomDist / (screenXfo.sc.y * (windowWidth/windowHeight));
      // recompute the screen fitting. TODO: this code shouldn't be int he event handler
      screenXfo.sc.x = windowWidth/(timeRange.y - timeRange.x);
      screenXfo.sc.y = -(windowHeight - 40) / (yRange.y - yRange.x)
      screenXfo.tr.x = -timeRange.x;
    // screenXfo.tr.y = (yRange.y + yRange.x) * -0.5;  
      updateTimeRange();
    }
    
    rootDomNode.addEventListener('mouseover', function(){
      document.addEventListener('mousewheel', mouseWheelZoomFn, false);
      document.addEventListener('DOMMouseScroll', mouseWheelZoomFn, false);
    }, false);
    
    rootDomNode.addEventListener('mouseout', function(){
      document.removeEventListener('mousewheel', mouseWheelZoomFn, false);
      document.removeEventListener('DOMMouseScroll', mouseWheelZoomFn, false);
    }, false);
  }
  
  var updateGraph = function(){
    tracksData = characterAnimationContainerNode.getTracks(trackSetId);
    updateTimeRange();
  }
  
  var updateGraphEventFn = function(evt){
    updateGraph();
  };
  
  characterAnimationContainerNode.addEventListener('keyframetrackchanged', updateGraphEventFn);
//  characterAnimationContainerNode.addEventListener('tracksetadded', updateGraphEventFn);
  window.onunload = function(){
    characterAnimationContainerNode.removeEventListener('keyframetrackchanged', updateGraphEventFn);
  //  characterAnimationContainerNode.removeEventListener('tracksetadded', updateGraphEventFn);
    if(updateTimeStripe){
      scene.removeEventListener('timechanged', updateTimeStripe);
    }
  };
  
  var resizeIntervalId;
  
  return {
    resize: function(){
      window.clearTimeout( resizeIntervalId );
      resizeIntervalId = window.setTimeout( function () {
          fitCurveEditorToWindow();
        }, 50 );
    },
    redraw: function(){
      updateGraph();
    },
    setKeyDisplayToggle: function(val){
      clearTrackCurves();
      options.drawKeys = val;
      drawTrackCurves();
    },
    setCurveFilters: function(filters){
      setCurveFilters(filters);
    },
    fitYRange: function(){
      //
    }
  }
};
