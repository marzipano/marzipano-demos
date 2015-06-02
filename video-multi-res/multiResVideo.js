'use strict';

// Marzipano does not have a high-level API for 360º video with multiple levels yet
// This code manages the currently playing video using the low-level API

(function() {
  var EventEmitter = window.EventEmitter;
  var EventEmitterProxy = window.EventEmitterProxy;
  var videoLayer = window.videoLayer;

  var stage = window.stage;

  var emitter = new EventEmitter();
  var videoEmitter = new EventEmitterProxy();

  var resolutions = [
    { width: 720 },
    { width: 1280 },
    { width: 1920 },
    { width: 2880 }
  ];

  var currentState = {
    layer: null,
    resolutionIndex: null,
    resolutionChanging: false
  };

  function setResolutionIndex(index, cb) {
    cb = cb || function() {};

    currentState.resolutionChanging = true;

    emitter.emit('change');
    emitter.emit('resolutionSet');

    var currentVideoLayer = stage.listLayers()[0];


    // Create layer with new video level and add it to the stage
    videoLayer.create(stage, resolutions[index], currentVideoLayer, function(err, layer) {
      if(err) {
        console.error(err);
        cb(err);
      }

      var oldLayers = stage.listLayers();
      stage.removeAllLayers();
      oldLayers.forEach(videoLayer.destroy);
      stage.addLayer(layer);

      videoEmitter.setObject(videoLayer.layerVideoElement(layer));

      currentState.layer = layer;
      currentState.resolutionIndex = index;
      currentState.resolutionChanging = false;

      emitter.emit('change');
      emitter.emit('resolutionChange');
      cb(null, layer);
    });
  }


  window.multiResVideo = {
    layer: function() {
      return currentState.layer;
    },
    element: function() {
      return currentState.layer ?
                videoLayer.layerVideoElement(currentState.layer) :
                null;
    },
    resolutions: function() {
      return resolutions;
    },
    resolutionIndex: function() {
      return currentState.resolutionIndex;
    },
    resolution: function() {
      return currentState.resolutionIndex != null ?
                resolutions[currentState.resolutionIndex] :
                null;
    },
    setResolutionIndex: setResolutionIndex,
    resolutionChanging: function() {
      return currentState.resolutionChanging;
    },
    addEventListener: emitter.addEventListener.bind(emitter),

    // events from proxy to videoElement
    addEventListenerVideo: videoEmitter.addEventListener.bind(videoEmitter)
  };
})();