'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  // Create Source
  var source = Marzipano.ImageUrlSource.fromString(
    "../common-media/outdoor/{z}/{f}/{y}/{x}.jpg",
    { cubeMapPreviewUrl: "../common-media/outdoor/preview.jpg" });

  // Create Geometry
  var geometry = new Marzipano.CubeGeometry([
    { tileSize: 256, size: 256, fallbackOnly: true },
    { tileSize: 512, size: 512 },
    { tileSize: 512, size: 1024 },
    { tileSize: 512, size: 2048 },
    { tileSize: 512, size: 4096 }
  ]);

  // Create View
  var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(4096, 100*Math.PI/180);
  var view = new Marzipano.RectilinearView(null, limiter);

  // Create and display Scene
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });

  scene.switchTo();

  var container = scene.hotspotContainer();

  // Create hotspot for the AdSense widget
  container.createHotspot(document.getElementById('adsense'), { yaw: -1.525, pitch: -0.395 }, { perspective: { radius: 2100, extraRotations: "rotateX(23deg) rotateY(2deg) rotateZ(0deg)" }});

  // Create hotspot for the Twitter widget
  container.createHotspot(document.getElementById('twitter'), { yaw: -1.434, pitch: -0.8 }, { perspective: { radius: 1900, extraRotations: "rotateX(42deg) rotateY(6deg) rotateZ(1deg)" }});

  // Create hotspot for the Facebook Like button
  container.createHotspot(document.getElementById('facebook'), { yaw: 0.8, pitch: -0.3 }, { perspective: { radius: 1500, extraRotations: "rotateX(17deg) rotateY(-10deg) rotateZ(0deg)" }});

  // Create hotspot with different sources
  container.createHotspot(document.getElementById('iframespot'), { yaw: 0.0335, pitch: -0.102 }, { perspective: { radius: 3280, extraRotations: "rotateX(5deg)" }});
  container.createHotspot(document.getElementById('iframeselect'), { yaw: -0.35, pitch: -0.239 });

  // Switch sources when clicked
  function switchHotspot(id) {
    var wrapper = document.getElementById('iframespot');
    wrapper.innerHTML = window.hotspotHtml[id];
  }

  var switchElements = document.querySelectorAll('[data-source]');
  for(var i = 0; i < switchElements.length; i++) {
    var element = switchElements[i];
    addClickEvent(element);
  }

  function addClickEvent(element) {
    element.addEventListener('click', function() {
      switchHotspot(element.getAttribute('data-source'));
    });
  }
})();