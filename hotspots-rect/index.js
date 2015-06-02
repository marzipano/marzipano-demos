'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);
  var stage = viewer.stage();

  // Create Source, Geometry and View
  var source = Marzipano.ImageUrlSource.fromString("../common-media/cube-single-res/{f}.jpg");
  var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(1024, 100*Math.PI/180);

  // Create scenes with different `rect` parameters and with hotspots
  var rects = [
    null,
    { relativeWidth: 0.6, relativeHeight: 0.3, relativeX: 0.6 },
    { relativeWidth: 0.6, relativeHeight: 0.7, relativeX: 0.4, relativeY: 0.3 }
  ];

  var marzipanoObjects = rects.map(function(rect) {
    var view = new Marzipano.RectilinearView(null);
    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore, { effects: { rect: rect }});
    var hotspotContainer = new Marzipano.HotspotContainer(viewer.domElement(), stage, view, viewer.renderLoop(), { rect: rect });

    var hotspotElement = document.createElement('div');
    hotspotElement.className = 'hotspot';
    var hotspot = hotspotContainer.createHotspot(hotspotElement, { yaw: 0.1, pitch: -0.3 });

    stage.addLayer(layer);

    return { layer: layer, hotspotContainer: hotspotContainer, hotspot: hotspot}
  });

  window.marzipanoObjects = marzipanoObjects;
})();