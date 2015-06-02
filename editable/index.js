'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var createEditableLayers = window.createEditableLayers;
  var mod = Marzipano.util.mod;
  var editMode = window.editMode;
  var brush = window.brush;

  var viewerElement = document.querySelector('#pano');

  // Initialize Viewer
  var viewerOpts = { swfPath: '../common-marzipano/marzipano.swf', stageType: null };
  var viewer = new Marzipano.Viewer(viewerElement, viewerOpts);
  var stage = viewer.stage();

  // Create layer
  createEditableLayers(stage, "../common-media/R0010526.JPG", function(err, layers) {
    if(err) { throw err; }
    stage.addLayer(layers.colorLayer);
    stage.addLayer(layers.desaturatedLayer);

    var colorCanvas = layers.colorLayer.source().asset().element();
    var desaturatedCanvas = layers.desaturatedLayer.source().asset().element();

    var view = layers.desaturatedLayer.view();
    var canvasAsset = layers.desaturatedLayer.source().asset();
    var canvas = desaturatedCanvas;
    var ctx = canvas.getContext('2d');

    document.querySelector("#desaturated-canvas-container").appendChild(desaturatedCanvas);
    document.querySelector("#color-canvas-container").appendChild(colorCanvas);

    // Export button
    document.querySelector("#export").addEventListener('click', exportImage);

    // Edit
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var previousPressPosition = null;

    // Enable edit mode with key press
    editMode.addEventListener('changed', function() {
      // The controls may change the cursor when disabled. Therefore, do that
      // before updating the cursor style.
      if(editMode.get()) {
        viewer.controls().disable();
      }
      else {
        viewer.controls().enable();
      }

      brush.updateCursor();
    });

    viewerElement.addEventListener('mousedown', function(e) {
      var pressPosition = { x: e.clientX, y: e.clientY };
      if(editMode.get()) {
        paintOnScreenXY(pressPosition);
        previousPressPosition = pressPosition;

        ctx.putImageData(imageData, 0, 0);
        canvasAsset.changed();
      }
    });

    viewerElement.addEventListener('mouseup', function() {
      previousPressPosition = null;
    });

    viewerElement.addEventListener('mousemove', function(e) {
      if(editMode.get() && previousPressPosition) {
        var pressPosition = { x: e.clientX, y: e.clientY };

        paintBetween(previousPressPosition, pressPosition);
        previousPressPosition = pressPosition;

        ctx.putImageData(imageData, 0, 0);
        canvasAsset.changed();

        e.stopPropagation();
      }

      // Update cursor
      brush.updateCursor(e);
    });


    function paintBetween(previous, current) {
      var x0 = previous.x;
      var x1 = current.x;
      var y0 = previous.y;
      var y1 = current.y;

      var distance = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));

      // Paint every some pixels
      var maxIntervalSize = 8;
      var intervals = Math.ceil(distance)/maxIntervalSize;

      var xInterval = (x1 - x0)/intervals;
      var yInterval = (y1 - y0)/intervals;

      for(var i = 0; i < intervals; i++) {
        paintOnScreenXY({ x: x0 + xInterval*i, y: y0 + yInterval*i });
      }

    }

    function paintOnScreenXY(screenXY) {
      var coordinates = view.screenToCoordinates(screenXY);

      var imageXY = coordinatesToEquirect(coordinates, canvas.width, canvas.height);

      var centerX = Math.floor(imageXY.x);
      var centerY = Math.floor(imageXY.y);
      checkAndPaint(centerX,    centerY,    1,  1, screenXY);
      checkAndPaint(centerX,    centerY-1,  1, -1, screenXY);
      checkAndPaint(centerX-1,  centerY,   -1,  1, screenXY);
      checkAndPaint(centerX-1,  centerY-1, -1, -1, screenXY);
    }

    function checkAndPaint(startX, startY, xDirection, yDirection, screenXY) {
      var pixelX, pixelY;
      for(pixelY = startY; ; pixelY = pixelY + yDirection) {
        // Should pixelY be wrapped around?
        if(pixelY > canvas.height) { break; }

        var anyInRange = false;
        var firstX = true;
        for(pixelX = startX; ; pixelX = mod(pixelX + xDirection, canvas.width)) {
          if(!firstX && pixelX === startX) { break; }
          firstX = false;
          if(paintIfInRange({ x: pixelX, y: pixelY }, screenXY)) {
            anyInRange = true;
          }
          else { break; }

        }
        if(!anyInRange) { break; }
      }
    }

    function paintIfInRange(pixelXY, screenXY) {
      var pixelCoordinates = equirectToCoordinates(pixelXY, canvas.width, canvas.height);
      var pixelScreenPosition  = view.coordinatesToScreen(pixelCoordinates);

      var intensity = calculateIntensity(screenXY, pixelScreenPosition);
      if(intensity > 0) {
        var alphaToSet = editMode.get() === 'hide' ? 0 : 255;
        var index = (pixelXY.y * imageData.width + pixelXY.x)*4;
        imageData.data[index+3] = imageData.data[index+3] * (1-intensity) + alphaToSet * intensity;
        return true;
      }
      else {
        return false;
      }
    }

    function exportImage() {
      var width = colorCanvas.width;
      var height = colorCanvas.height;

      var merged = document.createElement('canvas');
      merged.width = width;
      merged.height = height;
      var ctx = merged.getContext('2d');

      ctx.drawImage(colorCanvas, 0, 0);
      ctx.drawImage(desaturatedCanvas, 0, 0);

      var data = merged.toDataURL('image/jpeg', 85);
      window.open(data);
    }

  });



  function calculateIntensity(originXY, testXY) {
    var dist = Math.sqrt(
      (originXY.x - testXY.x) * (originXY.x - testXY.x) +
      (originXY.y - testXY.y) * (originXY.y - testXY.y));

    var intensity = Math.max((brush.radius - dist) / brush.radius, 0);
    return intensity;
  }

  function coordinatesToEquirect(coordinates, width, height) {
    var theta = mod(coordinates.yaw - Math.PI, 2 * Math.PI);
    var phi = mod((coordinates.pitch - Math.PI/2), Math.PI);

    var s = theta / (2 * Math.PI);
    var t = phi / Math.PI;

    var imageX = Math.floor(s * width);
    var imageY = Math.floor(t * height);

    return { x: imageX, y: imageY };
  }

  function equirectToCoordinates(imageXY, width, height) {
    var s = imageXY.x / width;
    var t = imageXY.y / height;

    var theta = s * 2 * Math.PI;
    var phi = t * Math.PI;

    var yaw = theta + Math.PI;
    var pitch = phi - Math.PI/2;

    return { yaw: yaw, pitch: pitch };
  }

})();