'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize viewer.
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', controls: { mouseViewMode: 'qtvr' } };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);
  var stage = viewer.stage();

  // Create foreground and background layers and add them to the stage
  var fov = 50 * Math.PI / 180;
  var pitch = 0.5521458744758476;
  var viewLimiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2048, 100*Math.PI/180);

  var background = createBackground(viewer, pitch, fov, viewLimiter);
  var foreground = createForeground(viewer, pitch, fov, viewLimiter);

  stage.addLayer(background);
  stage.addLayer(foreground);


  function createForeground(viewer, pitch, fov, viewLimiter) {
    //ake_apvm1pm_sphere
    //ake_avm_gang_sphere_fenster
    //ake_speisewagen2_fenster
    //aussichtswagen3_alpen1_vers2
    //avm_2_abteil_sb_sphere
    //bar2_fenster_backdrop - zona de aussichtswagen sem janelas tratadas

    var stage = viewer.stage();

    var source = new Marzipano.ImageUrlSource.fromString(
        "../common-media/transparent-panos/ake_speisewagen2_fenster/{z}/{f}/tile-{y}-{x}.png",
        { cubeMapPreviewUrl:  "../common-media/transparent-panos/ake_speisewagen2_fenster/preview.png" });

    var geometry = new Marzipano.CubeGeometry([
      { tileSize: 256, size: 256, fallbackOnly: true },
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 },
      { tileSize: 512, size: 2048 },
    ]);

    var viewParameters = { yaw: -0.3758316134782458, pitch: pitch, fov: fov };
    var view = new Marzipano.RectilinearView(viewParameters, viewLimiter);

    var textureStore = new Marzipano.TextureStore(geometry, source, stage);
    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore);

    layer.pinFirstLevel();

    return layer;
  }


  function createBackground(viewer, pitch, fov, viewLimiter) {
    var stage = viewer.stage();

    var source = new Marzipano.ImageUrlSource.fromString(
        "../common-media/eso0932a/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl:  "../common-media/eso0932a/preview.jpg" });

    var geometry = new Marzipano.CubeGeometry([
      { tileSize: 256, size: 256, fallbackOnly: true },
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 },
      { tileSize: 512, size: 2048 }
    ]);

    var view = new Marzipano.RectilinearView({ pitch: pitch, fov: fov }, viewLimiter);

    var textureStore = new Marzipano.TextureStore(geometry, source, stage);

    var layer = new Marzipano.Layer(stage, source, geometry, view, textureStore);

    layer.pinFirstLevel();

    /* Setup autorotate */
    var renderLoop = viewer.renderLoop();
    
    var autorotateStart = Marzipano.autorotate({ targetPitch: null, yawSpeed: 0.05 });
    var autorotateStep = autorotateStart();
    var startTime = performance.now();

    var params = {};

    function updateView() {
      var elapsed = performance.now() - startTime;

      // view.parameters() writes result to object rather than returning to
      // prevent garbage generation
      view.parameters(params);
      autorotateStep(params, elapsed);
      view.setParameters(params);

      renderLoop.renderOnNextFrame();
    }

    renderLoop.addEventListener('beforeRender', updateView);
    
    return layer;
  }

  window.foreground = foreground;
})();