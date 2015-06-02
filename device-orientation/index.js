'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var FullTiltControlMethod = window.FullTiltControlMethod;

  var toggleDeviceOrientationElement = document.getElementById('toggleDeviceOrientation');

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Register Gyro control method
  var deviceOrientationEnabled = false;
  var deviceOrientationControlMethod = new DeviceOrientationControlMethod();
  var controls = viewer.controls();
  controls.registerMethod('deviceOrientation', deviceOrientationControlMethod);

  // Create Source, Geometry and View
  var source = Marzipano.ImageUrlSource.fromString("../common-media/cube-single-res/{f}.jpg");
  var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(1024, 100*Math.PI/180);
  var view = new Marzipano.RectilinearView(null, limiter);


  // Create and display Scene
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  scene.switchTo();


  function enableGyro() {
    deviceOrientationControlMethod.getPitch(function(err, pitch) {
      if(!err) {
        view.setPitch(pitch);
      }
    });
    controls.enableMethod('deviceOrientation');
    deviceOrientationEnabled = true;
    toggleDeviceOrientationElement.className = 'enabled';
  }

  function disableGyro() {
    controls.disableMethod('deviceOrientation');
    deviceOrientationEnabled = false;
    toggleDeviceOrientationElement.className = '';
  }

  function toggleDeviceOrientation() {
    if(deviceOrientationEnabled) { disableGyro(); }
    else { enableGyro(); }
  }

  toggleDeviceOrientationElement.addEventListener('click', toggleDeviceOrientation);
})();