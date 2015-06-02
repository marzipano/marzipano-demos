  'use strict';

var Marzipano = window.Marzipano;

// Viewer options.
var viewerOpts = { swfPath: 'vendor/marzipano.swf' };

// Initialize viewer and scene
var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

var source = Marzipano.ImageUrlSource.fromString(
  "../common-media/museu-cinzeiros/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: "../common-media/museu-cinzeiros/preview.jpg" });

var geometry = new Marzipano.CubeGeometry([
    { "tileSize": 256, "size": 256, "fallbackOnly": true },
    { "size": 512, "tileSize": 512 },
    { "size": 1024, "tileSize": 512 },
    { "size": 2048, "tileSize": 512 }
]);

var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2048, 120*Math.PI/180);

var view = new Marzipano.RectilinearView(null, limiter);
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

scene.switchTo({ transitionDuration: 0 });
