'use strict';

var ko = window.ko;
var Marzipano = window.Marzipano;
var createEquirectLayer = window.createEquirectLayer;
var fileToCanvas = window.fileToCanvas;

// Viewer options.
var viewerOpts = { swfPath: 'vendor/marzipano.swf', stageType: 'webgl' };

// Initialize viewer and view
var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);

var limiter = Marzipano.RectilinearView.limit.maxResolutionAndMaxFov(2048, 120*Math.PI/180);
var view = new Marzipano.RectilinearView(null, limiter);

var layers = ko.observableArray([]);




document.getElementById('selectFilesButton').onclick = function() {
  document.getElementById('selectFilesInput').click();  
};

document.getElementById('selectFilesInput').addEventListener('change', function() {
  if (this.files && this.files.length > 0) {
    for(var i = 0; i < this.files.length; i++) {
      addLayer(this.files[i]);
    }
  }
  this.value = null;
});

function addLayer(file) {
  fileToCanvas(file, function(err, canvas) {
    if(err) {
      console.error(err);
      return;
    }

    if(canvas.width > viewer.stage().maxTextureSize() || canvas.height > viewer.stage().maxTextureSize()) {
      console.error("Image is too large: " + canvas.width + "x" + canvas.height + "px");
      return;
    }

    var layer = createEquirectLayer(viewer.stage(), view, canvas);
    viewer.stage().addLayer(layer);

    var effects = layerEffects(layer);

    layers.unshift({
      name: file.name,
      layer: layer,
      effects: effects,
      canvas: canvas
    });
  });

/*
var layers = ko.observableArray(layerData.map(function(l) {
  var layerAndCanvas = createEquirectLayer(viewer.stage(), view, l.url, l.width);

  var layer = layerAndCanvas.layer;
  var canvas = layerAndCanvas.canvas;
}));
*/
}

function layerEffects(layer) {
  var i, j, o;

  var opacity = ko.observable(1.0);
  var rect = {
    width: ko.observable(1.0),
    height: ko.observable(1.0),
    x: ko.observable(0.0),
    y: ko.observable(0.0)
  };

  var colorOffset = [];
  for(i = 0; i < 4; i++) {
    o = ko.observable(0);
    colorOffset.push(o);
    o.subscribe(updateEffects);
  }

  var colorMatrix = [];
  for(i = 0; i < 4; i++) {
    for(j = 0; j < 4; j++) {
      o = ko.observable(i === j ? 1 : 0);
      colorMatrix.push(o);
      o.subscribe(updateEffects);
    }
  }

  opacity.subscribe(updateEffects);
  rect.width.subscribe(updateEffects);
  rect.height.subscribe(updateEffects);
  rect.x.subscribe(updateEffects);
  rect.y.subscribe(updateEffects);

  function updateEffects() {
    layer.setEffects({
      opacity: opacity(),
      rect: {
        relativeWidth: rect.width(),
        relativeHeight: rect.height(),
        relativeY: rect.y(),
        relativeX: rect.x()
      },
      colorOffset: observableArrayFloatValues(colorOffset),
      colorMatrix: observableArrayFloatValues(colorMatrix)
    });
  }

  var presets = [ 'brightness', 'sepia', 'saturation', 'contrast' ];
  var selectedPreset = ko.observable();

  var brightnessAmount = ko.observable(0);
  var sepiaAmount = ko.observable(1);
  var saturationAmount = ko.observable(0);
  var contrastAmount = ko.observable(1);

  brightnessAmount.subscribe(function(amount) {
    colorEffectsToObservables(Marzipano.colorEffects.brightness(parseFloat(amount)));
  });
  sepiaAmount.subscribe(function(amount) {
    colorEffectsToObservables(Marzipano.colorEffects.sepia(parseFloat(amount)));
  });
  saturationAmount.subscribe(function(amount) {
    colorEffectsToObservables(Marzipano.colorEffects.saturation(parseFloat(amount)));
  });
  contrastAmount.subscribe(function(amount) {
    colorEffectsToObservables(Marzipano.colorEffects.contrast(parseFloat(amount)));
  });

  selectedPreset.subscribe(function(preset) {
    if(preset === 'brightness') {
      brightnessAmount.notifySubscribers(parseFloat(brightnessAmount()));
    }
    if(preset === 'sepia') {
      sepiaAmount.notifySubscribers(parseFloat(sepiaAmount()));
    }
    if(preset === 'saturation') {
      saturationAmount.notifySubscribers(parseFloat(saturationAmount()));
    }
    if(preset === 'contrast') {
      contrastAmount.notifySubscribers(parseFloat(contrastAmount()));
    }
  });

  function colorEffectsToObservables(effects) {
    for(i = 0; i < 4; i++) {
      colorOffset[i](effects.colorOffset[i]);
    }
    for(i = 0; i < 16; i++) {
      colorMatrix[i](effects.colorMatrix[i]);
    }
  }

  return {
          opacity: opacity,
          rect: rect,
          colorOffset: colorOffset,
          colorMatrix: colorMatrix,
          presets: presets,
          selectedPreset: selectedPreset,
          brightnessAmount: brightnessAmount,
          sepiaAmount: sepiaAmount,
          saturationAmount: saturationAmount,
          contrastAmount: contrastAmount
         };

}

function observableArrayFloatValues(arr) {
  return arr.map(function(o) { return parseFloat(o()); });
}

var maxSize = viewer.stage().maxTextureSize() + 'x' + viewer.stage().maxTextureSize()/2 + 'px';

var viewModel = {
  layers: layers,
  maxSize: maxSize
};

ko.applyBindings(viewModel);