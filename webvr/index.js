'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var mat4 = window.mat4;
  var quat = window.quat;
  var getWakeLock = window.getWakeLock;

  var vrFovsToViewParams = Marzipano.RectilinearView.projectionCenter.vrFovsToViewParams;
  var degToRad = Marzipano.util.degToRad;

  var viewerElement = document.querySelector("#pano");
  var enterVrElement = document.querySelector("#enter-vr");
  var noVrElement = document.querySelector("#no-vr");

  // Initialize Viewer
  // TODO: we do not need Controls or RenderLoop. Use Stage directly instead of Viewer.
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(viewerElement, viewerOpts);
  var stage = viewer.stage();

  // Create Layers
  var geometry = new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { tileSize: 512, size: 512 },
    { tileSize: 512, size: 1024 },
    { tileSize: 512, size: 2048 },
    { tileSize: 512, size: 4096 }
  ]);

  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(4096, 110*Math.PI/180);
  var viewLeft = new Marzipano.RectilinearView(null, limiter);
  var viewRight = new Marzipano.RectilinearView(null, limiter);

  var layerLeft = createLayer(stage, viewLeft, geometry, 'left', { relativeWidth: 0.5, relativeX: 0 });
  var layerRight = createLayer(stage, viewRight, geometry, 'right', { relativeWidth: 0.5, relativeX: 0.5 });

  stage.addLayer(layerLeft);
  stage.addLayer(layerRight);

  viewer.controls().disable();


  var vrDevices = null;

  if (screen.orientation) {
    screen.orientation.lock('landscape');
  }

  var WakeLock = getWakeLock();
  var wakeLock = new WakeLock();
  wakeLock.request();

  enterVrElement.addEventListener('click', function() {
    if (viewerElement.mozRequestFullScreen) {
      viewerElement.mozRequestFullScreen({ vrDisplay: vrDevices.hmd });
    }
    else if (viewerElement.webkitRequestFullscreen) {
      console.log("vrDisplay", vrDevices.hmd);
      viewerElement.webkitRequestFullscreen({ vrDisplay: vrDevices.hmd });
    }
  });

  getHMD().then(function(detected) {
    vrDevices = detected;

    // Enter VR mode button
    if(vrDevices.hmd) {
      enterVrElement.style.display = 'block';

      // TODO: set projectionCenter according to angle
      var leftEyeParameters = vrDevices.hmd.getEyeParameters("left");
      var rightEyeParameters = vrDevices.hmd.getEyeParameters("right");

      setProjectionCenter(viewLeft, leftEyeParameters);
      setProjectionCenter(viewRight, rightEyeParameters);
    }
    else {
      noVrElement.style.display = 'block';
    }

    if(vrDevices.positionSensor) {
      requestAnimationFrame(controlViewWithPositionSensor);
    }
  });

  var positionSensorQuartenion = quat.create();
  var positionSensorMatrix = mat4.create();
  var positionSensorParameters = {};



  function createLayer(stage, view, geometry, eye, rect) {
    var source = new Marzipano.ImageUrlSource.fromString(
        "../common-media/music-room/" + eye + ".tiles/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl:  "../common-media/music-room/" + eye + ".tiles/preview.jpg" });

    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore, { effects: { rect: rect }});

    layer.pinFirstLevel();

    return layer;
  }

  function setProjectionCenter(view, eyeParameters) {
    var fovs = eyeParameters.recommendedFieldOfView;
    var viewParams = vrFovsToViewParams(degToRad(fovs.upDegrees),
                                        degToRad(fovs.downDegrees),
                                        degToRad(fovs.leftDegrees),
                                        degToRad(fovs.rightDegrees));
    view.setParameters({
      projectionCenterX: viewParams.projectionCenterX,
      projectionCenterY: viewParams.projectionCenterY,
      fov: viewParams.vfov
    });
  }
  function controlViewWithPositionSensor() {
    var state = vrDevices.positionSensor.getState();

    if(state.hasOrientation) {
      if(state.orientation) {
        var o = state.orientation;
        quat.set(positionSensorQuartenion, o.x, o.y, o.z, o.w);
        mat4.fromQuat(positionSensorMatrix, positionSensorQuartenion);

        eulerFromMat4(positionSensorMatrix, positionSensorParameters);

        var parameters = {
          yaw: -positionSensorParameters._y,
          pitch: -positionSensorParameters._x,
          roll: -positionSensorParameters._z
        };

        viewLeft.setParameters(parameters);
        viewRight.setParameters(parameters);
      }
    }
    requestAnimationFrame(controlViewWithPositionSensor);
  }

  function getHMD() {
    return new Promise(function(resolve, reject) {
      var detectedHmd = null;
      var detectedPositionSensor = null;

      navigator.getVRDevices().then(function(devices) {
        console.log(devices);
        // Promise succeeds, but check if there are any devices actually.
        var i;
        for (i = 0; i < devices.length; i++) {
          if (devices[i] instanceof HMDVRDevice) {
            detectedHmd = devices[i];
            break;
          }
        }
        for (i = 0; i < devices.length; i++) {
          if (devices[i] instanceof PositionSensorVRDevice) {
            detectedPositionSensor = devices[i];
            break;
          }
        }
        resolve({ hmd: detectedHmd, positionSensor: detectedPositionSensor });
      }, function() {
        // No devices are found.
        resolve({});
      });
    });
  }

  function eulerFromMat4(rotationMatrix, result) {
    // Adapted from Three.js
    // https://github.com/mrdoob/three.js/blob/master/src/math/Euler.js

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = rotationMatrix;

    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
    var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
    var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

    var order = 'YXZ';

    if ( order === 'XYZ' ) {

      result._y = Math.asin( clamp( m13, - 1, 1 ) );

      if ( Math.abs( m13 ) < 0.99999 ) {

        result._x = Math.atan2( - m23, m33 );
        result._z = Math.atan2( - m12, m11 );

      } else {

        result._x = Math.atan2( m32, m22 );
        result._z = 0;

      }

    } else if ( order === 'YXZ' ) {

      result._x = Math.asin( - clamp( m23, - 1, 1 ) );

      if ( Math.abs( m23 ) < 0.99999 ) {

        result._y = Math.atan2( m13, m33 );
        result._z = Math.atan2( m21, m22 );

      } else {

        result._y = Math.atan2( - m31, m11 );
        result._z = 0;

      }

    } else if ( order === 'ZXY' ) {

      result._x = Math.asin( clamp( m32, - 1, 1 ) );

      if ( Math.abs( m32 ) < 0.99999 ) {

        result._y = Math.atan2( - m31, m33 );
        result._z = Math.atan2( - m12, m22 );

      } else {

        result._y = 0;
        result._z = Math.atan2( m21, m11 );

      }

    } else if ( order === 'ZYX' ) {

      result._y = Math.asin( - clamp( m31, - 1, 1 ) );

      if ( Math.abs( m31 ) < 0.99999 ) {

        result._x = Math.atan2( m32, m33 );
        result._z = Math.atan2( m21, m11 );

      } else {

        result._x = 0;
        result._z = Math.atan2( - m12, m22 );

      }

    } else if ( order === 'YZX' ) {

      result._z = Math.asin( clamp( m21, - 1, 1 ) );

      if ( Math.abs( m21 ) < 0.99999 ) {

        result._x = Math.atan2( - m23, m22 );
        result._y = Math.atan2( - m31, m11 );

      } else {

        result._x = 0;
        result._y = Math.atan2( m13, m33 );

      }

    } else if ( order === 'XZY' ) {

      result._z = Math.asin( - clamp( m12, - 1, 1 ) );

      if ( Math.abs( m12 ) < 0.99999 ) {

        result._x = Math.atan2( m32, m22 );
        result._y = Math.atan2( m13, m11 );

      } else {

        result._x = Math.atan2( - m23, m33 );
        result._y = 0;

      }

    } else {

      THREE.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

    }

  };

  function clamp( x, a, b ) {
    return ( x < a ) ? a : ( ( x > b ) ? b : x );
  }

})();