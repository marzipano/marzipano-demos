'use strict';

(function() {
  var _ = window._;
  var ko = window.ko;
  var Marzipano = window.Marzipano;

  // Mapbox API access token
  var accessToken = "pk.eyJ1IjoiZGlnaXNmZXJhIiwiYSI6ImMzZTBlMDY0MTNiNGFmM2U3NTE1ZTIxMzc5MDlhODU1In0.OWJGMKKQKgNwlMr5DoWFLQ";

  // Number of zoom levels
  var numLevels = 18;

  // Map styles
  var styleMap = {
    "Streets": "mapbox.streets",
    "Satellite": "mapbox.streets-satellite",
    "Light": "mapbox.light",
    "Dark": "mapbox.dark",
  };

  // Initialize viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: 'webgl' };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Generate the URL for a tile
  var tileUrl = function(style, z, x, y) {
    return "http://api.tiles.mapbox.com/v4/" + style + "/" + z + "/" + x + "/" + y + "@2x.png?access_token=" + accessToken;
  };

  // Create view shared by all scenes
  var limiter = Marzipano.util.compose(
    Marzipano.FlatView.limit.resolution(512*Math.pow(2, numLevels-1)),
    Marzipano.FlatView.limit.letterbox()
  );
  var view = new Marzipano.FlatView({ mediaAspectRatio: 1 }, limiter);

  // Create geometry shared by all scenes
  var geometry = new Marzipano.FlatGeometry(_.map(_.range(numLevels), function(i) {
    return {
      width: 512*Math.pow(2, i),
      height: 512*Math.pow(2, i),
      tileWidth: 512,
      tileHeight: 512
    };
  }));

  // Create a source for the given map style
  var createSource = function(name) {
    var style = styleMap[name];
    return new Marzipano.ImageUrlSource(function(tile) {
      return { url: tileUrl(style, tile.z, tile.x, tile.y) };
    });
  };

  // Create one scene for each map style
  var sceneMap = {};
  for (var name in styleMap) {
    sceneMap[name] = viewer.createScene({
      source: createSource(name),
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });
  }

  // Create an observable for the currently selected map style
  var selectedStyle = ko.observable();

  // Switch to the selected style
  selectedStyle.subscribe(function(name) {
    var scene = sceneMap[name];
    if (scene != null) {
      scene.switchTo();
    }
  });

  // Apply knockout bindings against the view model
  ko.applyBindings({
    styleList: Object.keys(styleMap),
    selectedStyle: selectedStyle
  });

})();