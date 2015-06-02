'use strict';

(function() {
var Marzipano = window.Marzipano;
var colorEffects = Marzipano.colorEffects;

function createEditableLayers(stage, url, cb) {
  canvasFromUrl(url, function(err, canvas) {
    if(err) { return cb(err); }

    // Copy for the desaturated layer
    var canvas2 = desaturated(canvas);


    // Common objects
    var geometry = new Marzipano.EquirectGeometry([{ width: canvas.width }]);
    var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(canvas.width/4 * 1.5, 100*Math.PI/180);
    var view = new Marzipano.RectilinearView(null, limiter);

    // Color layer
    var asset = new Marzipano.DynamicCanvasAsset(canvas);
    var source = new Marzipano.SingleAssetSource(asset);
    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var colorLayer = new Marzipano.Layer(stage, source, geometry, view, textureStore);

    // Desaturated layer
    var asset2 = new Marzipano.DynamicCanvasAsset(canvas2);
    var source2 = new Marzipano.SingleAssetSource(asset2);
    var textureStore2 = new Marzipano.TextureStore(geometry, source2, stage);
    var desaturatedLayer = new Marzipano.Layer(stage, source2, geometry, view, textureStore2);

    cb(null, { colorLayer: colorLayer, desaturatedLayer: desaturatedLayer });
  });
}

function canvasFromUrl(url, cb) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var img = new Image();

  img.onload = function(){
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0); // Or at whatever offset you like
    cb(null, canvas);
  };

  img.onerror = function(e) {
    cb(e);
  };

  img.src = url;
}

function desaturated(source) {
  var canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  var ctx = canvas.getContext('2d');

  var imageData = source.getContext('2d').getImageData(0, 0, source.width, source.height);
  colorEffects.applyToImageData(imageData, colorEffects.saturation(0));
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

window.createEditableLayers = createEditableLayers;

})();