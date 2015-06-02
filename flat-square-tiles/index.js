'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Create Source
  var tileUrl = function(face, z, x, y) {
    return "../common-media/lx-giga.tiles/l" + z + "/" + y + "/l" + z + '_' + y + '_' + x + ".jpg";
  };

  var source = new Marzipano.ImageUrlSource(function(tile) {
    return { url: tileUrl(tile.face, tile.z+1, tile.x+1, tile.y+1) };
  });

  // Create Geometry
  var geometry = new Marzipano.FlatGeometry([
    { width: 756,  height: 312,    tileWidth: 756, tileHeight: 756 },
    { width: 1512,  height: 624,   tileWidth: 756, tileHeight: 756 },
    { width: 3024,  height: 1248,  tileWidth: 756, tileHeight: 756 },
    { width: 6048,  height: 2496,  tileWidth: 756, tileHeight: 756 },
    { width: 12096, height: 4992,  tileWidth: 756, tileHeight: 756 },
    { width: 24192, height: 9984,  tileWidth: 756, tileHeight: 756 },
    { width: 48384, height: 19968, tileWidth: 756, tileHeight: 756 }
  ]);

  // Create View
  var limiter = Marzipano.util.compose(
    Marzipano.FlatView.limit.resolution(48384),
    Marzipano.FlatView.limit.letterbox()
  );
  var view = new Marzipano.FlatView({ mediaAspectRatio: 48384/19968}, limiter);

  // Create and display Scene
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  scene.switchTo();
})();