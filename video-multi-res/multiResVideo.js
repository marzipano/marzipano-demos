'use strict';

// Marzipano does not have a high-level API for 360º video with multiple levels yet
// This code manages the currently playing video using the low-level API

(function() {
  var EventEmitter = window.EventEmitter;
  var EventEmitterProxy = window.EventEmitterProxy;
  var viewer = window.viewer;
  var Marzipano = window.Marzipano;
  var loadVideoInSync = window.loadVideoInSync;
  var NullVideoElementWrapper = window.NullVideoElementWrapper;
  var CanvasHackVideoElementWrapper = window.CanvasHackVideoElementWrapper;

  // Use canvas hack for IE10
  var browser = Marzipano.dependencies.bowser.browser;
  var useCanvasHack = browser.msie;

  // Create layer
  var asset = new Marzipano.VideoAsset();
  var source = new Marzipano.SingleAssetSource(asset);
  var geometry = new Marzipano.EquirectGeometry([ { width: 1 } ]);

  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2560, 100*Math.PI/180);
  var view = new Marzipano.RectilinearView(null, limiter);

  var scene = viewer.createScene({ source: source, geometry: geometry, view: view, pinFirstLevel: false });

  scene.switchTo({ transitionDuration: 0 });


  var emitter = new EventEmitter();
  var videoEmitter = new EventEmitterProxy();

  var resolutions = [
    { width: 720 },
    { width: 1280 },
    { width: 1920 },
    { width: 2880 }
  ];

  var currentState = {
    resolutionIndex: null,
    resolutionChanging: false
  };

  function setResolutionIndex(index, cb) {
    cb = cb || function() {};

    currentState.resolutionChanging = true;

    videoEmitter.setObject(null);

    emitter.emit('change');
    emitter.emit('resolutionSet');

    var level = resolutions[index];
    var videoSrc = '../common-media/video/mercedes-f1-' + level.width + 'x' + level.width/2 + '.mp4';

    var previousVideo = asset.video() && asset.video().videoElement();

    loadVideoInSync(videoSrc, previousVideo, function(err, element) {
      if(err) { 
        cb(err);
        return;
      }

      if(previousVideo) {
        previousVideo.pause();
        previousVideo.volume = 0;
        previousVideo.removeAttribute('src');
      }

      var VideoElementWrapper = useCanvasHack ? CanvasHackVideoElementWrapper : NullVideoElementWrapper;
      var wrappedVideo = new VideoElementWrapper(element);
      asset.setVideo(wrappedVideo);

      currentState.resolutionIndex = index;
      currentState.resolutionChanging = false;

      videoEmitter.setObject(element);

      emitter.emit('change');
      emitter.emit('resolutionChange');

      cb();
    });
  }


  window.multiResVideo = {
    layer: function() {
      return scene.layer();
    },
    element: function() {
      return asset.video() && asset.video().videoElement();
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