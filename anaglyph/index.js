'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var colorTransformEffects = window.colorTransformEffects;


  // Initialize viewer

  // Doing the blending for the anaglyph is only supported on the WebGL stage
  // Using the blending functions gl.ONE, gl.ONE will sum the channels on the two layers
  // One of the layers will only have a red channel and the other only blue and green
  var blendFunc = [ 'ONE', 'ONE' ];
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: 'webgl', blendFunc: blendFunc };
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
  var view = new Marzipano.RectilinearView(null, viewLimiter);

  var left = createLayer(viewer.stage(), view, geometry, 'left');
  var right = createLayer(viewer.stage(), view, geometry, 'right');

  stage.addLayer(right);
  stage.addLayer(left);


  function createLayer(stage, view, geometry, eye, effects) {
    var source = new Marzipano.ImageUrlSource.fromString(
        "../common-media/music-room/" + eye + ".tiles/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl:  "../common-media/music-room/" + eye + ".tiles/preview.jpg" });

    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore, { effects: effects });

    layer.pinFirstLevel();

    return layer;
  }

  var typeElement = document.getElementById('type');
  function updateEffects() {
    var type = typeElement.value;
    var effects = colorTransformEffects[type]();
    left.setEffects(effects.red);
    right.setEffects(effects.blue);
  }

  updateEffects();
  typeElement.addEventListener('change', updateEffects);



})();