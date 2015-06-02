'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: 'webgl' };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);
  var stage = viewer.stage();

  // Create left and right layers
  var geometry = new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { tileSize: 512, size: 512 },
    { tileSize: 512, size: 1024 },
    { tileSize: 512, size: 2048 },
    { tileSize: 512, size: 4096 }
  ]);

  // View can be reused because both layers have the same size
  var viewLimiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(3100, 100*Math.PI/180);

  var viewLeft = new Marzipano.RectilinearView(null, viewLimiter);
  var viewRight = new Marzipano.RectilinearView(null, viewLimiter);

  var left = createLayer(viewer.stage(), viewLeft, geometry, 'left', { relativeWidth: 0.5, relativeX: 0 });
  var right = createLayer(viewer.stage(), viewRight, geometry, 'right', { relativeWidth: 0.5, relativeX: 0.5 });

  stage.addLayer(right);
  stage.addLayer(left);

  function createLayer(stage, view, geometry, eye, rect) {
    var source = new Marzipano.ImageUrlSource.fromString(
        "../common-media/music-room/" + eye + ".tiles/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl:  "../common-media/music-room/" + eye + ".tiles/preview.jpg" });

    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore, { effects: { rect: rect }});

    layer.pinFirstLevel();

    return layer;
  }

  // Adjust projection center
  var projectionCenterXElement = document.querySelector("#projection-center-x");
  var projectionCenterYElement = document.querySelector("#projection-center-y");

  projectionCenterXElement.addEventListener('input', function() {
    var projectionCenterX = projectionCenterXElement.value;
    viewLeft.setProjectionCenterX(parseFloat(projectionCenterX));
    viewRight.setProjectionCenterX(parseFloat(-projectionCenterX));
  });
  projectionCenterYElement.addEventListener('input', function() {
    var projectionCenterY = projectionCenterYElement.value;
    viewLeft.setProjectionCenterY(parseFloat(projectionCenterY));
    viewRight.setProjectionCenterY(parseFloat(projectionCenterY));
  });

})();