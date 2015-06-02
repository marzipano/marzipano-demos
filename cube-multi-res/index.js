'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Create Source

  // The tiles were generated with the krpano tools, which indexes the tiles
  // starting on 1 instead of 0. Therefore we cannot use ImageUrlSource.fromString()
  var previewUrl = "../common-media/prague.tiles/preview.jpg";
  var tileUrl = function(face, z, x, y) {
    return "../common-media/prague.tiles/" + z + "/" + face + "/" + y + "/" + x + ".jpg";
  };

  var source = new Marzipano.ImageUrlSource(function(tile) {
    if(tile.z === 0) {
      var mapY = 'lfrbud'.indexOf(tile.face) / 6;
      return { url: previewUrl, rect: { x: 0, y: mapY, width: 1, height: 1/6 }};
    }
    else {
      return { url: tileUrl(tile.face, tile.z, tile.x+1, tile.y+1) };
    }
  });

  // Create Geometry
  var geometry = new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { tileSize: 512, size: 512 },
    { tileSize: 512, size: 1024 },
    { tileSize: 512, size: 2048 },
    { tileSize: 512, size: 4096 },
    { tileSize: 512, size: 8192 },
    { tileSize: 512, size: 16384 },
    { tileSize: 512, size: 32768 },
    { tileSize: 512, size: 65536 }
  ]);

  // Create View
  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(65536, 100*Math.PI/180);
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