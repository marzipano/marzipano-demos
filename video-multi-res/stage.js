'use strict';

(function() {
  var Marzipano = window.Marzipano;

  // Initialize Viewer
  var viewerOpts = { stageType: 'webgl', watermarkPosition: { top: 15 } };
  var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

  window.stage = viewer.stage();
})();