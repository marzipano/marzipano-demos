'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var APP_DATA = window.APP_DATA;

  // Grab elements from DOM.
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');

  // Prevent tap delay on mobile browsers.
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  });

  // Detect mobile mode.
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
      }
    };
    var mql = matchMedia("(max-width: 450px), (max-height: 400px)");
    setMode();
    mql.addListener(setMode);
  }

  // Viewer options.
  var viewerOpts = {
    controls: {
      mouseViewMode: APP_DATA.settings.mouseViewMode
    },
    swfPath: '../common-marzipano/marzipano.swf'
  };

  // Initialize viewer.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // Setup autorotate.
  var autorotate = Marzipano.autorotate({ yawSpeed: 0.1, targetPitch: 0, targetFov: Math.PI/2 });
  if (APP_DATA.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  // Create scenes.
  var scenes = APP_DATA.scenes.map(function(sceneData) {
    var source = Marzipano.ImageUrlSource.fromString(
      "../common-media/" + sceneData.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: "../common-media/" + sceneData.id + "/preview.jpg" });
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);
    var resolution = sceneData.levels[sceneData.levels.length-1].size;
    var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(resolution, 120*Math.PI/180);
    
    var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);
    var marzipanoScene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Create hotspots.
    sceneData.hotspots.forEach(function(hotspot) {
      var img = document.createElement('img');
      img.src = 'img/hotspot.png';
      img.classList.add('hotspot');
      img.addEventListener('click', function() {
        switchScene(findSceneById(hotspot.target));
      });
      marzipanoScene.createHotspot(img, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: sceneData,
      marzipanoObject: marzipanoScene
    };
  });

  // Display the initial scene.
  switchScene(scenes[0]);

  // Set handler for autorotate toggle.
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // Set handler for scene list toggle.
  sceneListToggleElement.addEventListener('click', toggleSceneList);

  // Start with the scene list open on desktop.
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  // Set handler for scene switch.
  scenes.forEach(function(scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    el.addEventListener('click', function() {
      switchScene(scene);
      // On mobile, hide scene list after selecting a scene.
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.marzipanoObject.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function showSceneList() {
    sceneListElement.classList.add('enabled');
    sceneListToggleElement.classList.add('enabled');
  }

  function hideSceneList() {
    sceneListElement.classList.remove('enabled');
    sceneListToggleElement.classList.remove('enabled');
  }

  function toggleSceneList() {
    if (sceneListElement.classList.contains('enabled')) {
      hideSceneList();
    } else {
      showSceneList();
    }
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

})();