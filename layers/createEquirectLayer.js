'use strict';

function createEquirectLayer(stage, view, canvas) {
  var Marzipano = window.Marzipano;

  var asset = new Marzipano.DynamicCanvasAsset(canvas);
  var source = new Marzipano.SingleAssetSource(asset);
  var geometry = new Marzipano.EquirectGeometry([{ width: canvas.width }]);

  var textureStore = new Marzipano.TextureStore(geometry, source, stage);

  var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore);

  return layer;
}

window.createEquirectLayer = createEquirectLayer;