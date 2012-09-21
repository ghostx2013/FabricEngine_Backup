/*
 *  Copyright 2010-2012 Fabric Engine Inc. All rights reserved.
 */

var constructHistogram = function(domRootID, options){
  
  var keyColor = FABRIC.rgb(.0, .0, .0);
  
  options = options ? options : {};
  options.draggable = options.draggable!=undefined ? options.draggable : true;
  options.zoomable = options.zoomable!=undefined ? options.zoomable : true;
  options.rangeX = options.rangeX!=undefined ? options.rangeX : new FABRIC.RT.Vec2(0, 100);
  
  var rootDomNode = document.getElementById(domRootID);
  var windowWidth = rootDomNode.clientWidth;
  var windowHeight = rootDomNode.clientHeight;
  
  var svgRoot = FABRIC.createSVGRootElem(domRootID);
//  svgRoot.attr('style', "position:relative; top:-"+windowHeight+"px;z-index:0");
  
  var polygon = svgRoot.createPolygon();

  polygon.attr('stroke', "black");
  polygon.attr('stroke-width', 0.5);
  polygon.attr('fill', "#66CC00");

  var generateGraph = function(histogramData, maxYValue){
    polygon.removeAllPoints();
    maxYValue = maxYValue ? maxYValue : 1.0;
    polygon.addPoint(0, windowHeight);
    polygon.addPoint(0, windowHeight*0.9);
    var numSamples = windowWidth;
    for(var i=0; i<numSamples; i++){
      var x = Math.round((i/numSamples)*windowWidth);
      var y = histogramData[Math.round((i/numSamples)*histogramData.length)] * 1/maxYValue;
      if(y>1.0) y = 1.0;
      polygon.addPoint(x, (1.0 - y)*(windowHeight*0.9));
    };
    polygon.addPoint(windowWidth, windowHeight*0.9);
    polygon.addPoint(windowWidth, windowHeight);
    polygon.updateShape();
  }
  var histogramWidget = {
    setData:function(data, maxYValue){
      generateGraph(data, maxYValue);
    }
  };
  return histogramWidget;  
};
