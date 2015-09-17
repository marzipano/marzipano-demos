'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Create Source
  var tileUrl = function(face, z, x, y) {
    return "../common-media/prague.tiles/" + z + "/" + face + "/" + y + "/" + x + ".jpg";
  };

  var source = new Marzipano.ImageUrlSource(function(tile) {
    return { url: tileUrl('f', tile.z+1, tile.x+1, tile.y+1) };
  });

  // Create Geometry
  var geometry = new Marzipano.FlatGeometry([
    //{ tileWidth: 256, width: 256, fallbackOnly: true },
    { tileWidth: 512, tileHeight: 512, width: 512,   height: 512 },
    { tileWidth: 512, tileHeight: 512, width: 1024,  height: 1024 },
    { tileWidth: 512, tileHeight: 512, width: 2048,  height: 2048 },
    { tileWidth: 512, tileHeight: 512, width: 4096,  height: 4096 },
    { tileWidth: 512, tileHeight: 512, width: 8192,  height: 8192 },
    { tileWidth: 512, tileHeight: 512, width: 16384, height: 16384 },
    { tileWidth: 512, tileHeight: 512, width: 32768, height: 32768 },
    { tileWidth: 512, tileHeight: 512, width: 65536, height: 65536 }
  ]);

  // Create View
  var limiter = Marzipano.util.compose(
    Marzipano.FlatView.limit.visibleX(0, 1),
    Marzipano.FlatView.limit.visibleY(0, 1)
  );
  var view = new Marzipano.FlatView({ mediaAspectRatio: 1}, limiter);

  // Create and display Scene
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  scene.switchTo();
})();