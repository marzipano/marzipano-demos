'use strict';

var Marzipano = window.Marzipano;
var easing = window.easing;
var transitionUpdateFunctions = window.transitionUpdateFunctions;

// Viewer options.
var viewerOpts = { swfPath: 'vendor/marzipano.swf' };

// Initialize viewer and scene
var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

var geometry = new Marzipano.CubeGeometry([
    { "tileSize": 256, "size": 256, "fallbackOnly": true },
    { "size": 512, "tileSize": 512 },
    { "size": 1024, "tileSize": 512 },
    { "size": 2048, "tileSize": 512 }
]);

var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2048, 120*Math.PI/180);

var view1 = new Marzipano.RectilinearView(null, limiter);

var source1 = Marzipano.ImageUrlSource.fromString(
  "../common-media/museu_da_electricidade/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: "../common-media/museu_da_electricidade/preview.jpg" });

var scene1 = viewer.createScene({
  source: source1,
  geometry: geometry,
  view: view1,
  pinFirstLevel: true
});

var view2 = new Marzipano.RectilinearView(null, limiter);

var source2 = Marzipano.ImageUrlSource.fromString(
  "../common-media/jeronimos/{z}/{f}/{y}/{x}.jpg",
  { cubeMapPreviewUrl: "../common-media/jeronimos/preview.jpg" });

var scene2 = viewer.createScene({
  source: source2,
  geometry: geometry,
  view: view2,
  pinFirstLevel: true
});

var currentScene = scene1;

currentScene.switchTo({ transitionDuration: 0 });

function changeScene(transitionDuration, transitionUpdate) {
  swapScenes().switchTo({ transitionDuration: transitionDuration, transitionUpdate: transitionUpdate });
}

function swapScenes() {
  if(currentScene === scene1) {
    currentScene = scene2;
    return scene2;
  }
  else if(currentScene === scene2) {
    currentScene = scene1;
    return scene1;
  }
  else {
    throw new Error("Something went wrong");
  }
}

// Export the variables to window
window.viewer = viewer;

// Display the initial scene.
window.changeScene = changeScene;


// Transition when a menu item is clicked
var menuItems = document.querySelectorAll("[data-easing]");

for(var i = 0; i < menuItems.length; i++) {
  initMenuItem(menuItems[i]);
}

function initMenuItem(item) {
  var fun = transitionUpdateFunctions[item.getAttribute('data-fun')];
  var time = parseInt(item.getAttribute('data-time'));
  var ease = easing[item.getAttribute('data-easing')];

  item.onclick = function() {
    changeScene(time, fun(ease));
  } 
}

// Populate custom animation easings
var easingSelect = document.getElementById("easing");
for(var key in easing) {
  var el = document.createElement('option');
  el.value = key;
  el.innerHTML = key;
  easingSelect.appendChild(el);
}

// Populate custom animation functions
var funSelect = document.getElementById("fun");
for(var key in transitionUpdateFunctions) {
  var el = document.createElement('option');
  el.value = key;
  el.innerHTML = key;
  funSelect.appendChild(el);
}

var timeInput = document.getElementById("time");
document.getElementById('customForm').onsubmit = function(e) {
  var time = timeInput.value;
  var fun = transitionUpdateFunctions[funSelect.value];
  var ease = easing[easingSelect.value];

  changeScene(time, fun(ease));

  e.preventDefault();
}