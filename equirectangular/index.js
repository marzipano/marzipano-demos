'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Create Source, Geometry and View
  var source = Marzipano.ImageUrlSource.fromString("../common-media/equirect.jpg");
  var geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(1024, 100*Math.PI/180);
  var view = new Marzipano.RectilinearView(null, limiter);

  // Create and display Scene
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  scene.switchTo();
})();