'use strict';

(function() {

  var Marzipano = window.Marzipano;
  var loadVideoInSync = window.loadVideoInSync;

  function create(stage, level, oldLayer, callback) {
    // Create a new video layer. The current video is paused while the new level
    // loads. It would also be possible to keep playing it and synchronize the
    // two videos, but it is a bit more involved.

    // Get the current parameters to synchronize
    var oldVideoElement = null;
    var viewParameters = null;

    if(oldLayer) {
      viewParameters = oldLayer.view().parameters();
      oldVideoElement = layerVideoElement(oldLayer);
    }

    var videoSrc = '../common-media/video/mercedes-f1-' + level.width + 'x' + level.width/2 + '.mp4';
    loadVideoInSync(videoSrc, oldVideoElement, function(err, videoElement) {
      if(err) { 
        callback(err);
        return;
      }

      // Create layer
      var asset = new Marzipano.VideoAsset(videoElement);
      var source = new Marzipano.SingleAssetSource(asset);
      var geometry = new Marzipano.EquirectGeometry([ level ]);

      var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2560, 100*Math.PI/180);
      var view = new Marzipano.RectilinearView(viewParameters, limiter);

      var textureStore = new Marzipano.TextureStore(geometry, source, stage);

      var effects = oldLayer ? oldLayer.effects() : null;
      var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore, { effects: effects });

      callback(null, layer);
    });
  }

  function destroy(layer) {
    layer.source().asset().destroy();
    layer.view().destroy();
    layer.textureStore().destroy();
    layer.destroy();
  }

  function layerVideoElement(layer) {
    if(!layer) { return null; }
    return layer.source().asset().videoElement();
  }

  window.videoLayer = {
    create: create,
    destroy: destroy,
    layerVideoElement: layerVideoElement
  };

})();