'use strict';

function fileToCanvas(file, cb) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  
  var img = document.createElement('img');

  img.onload = function() {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    cb(null, canvas);
  };

  img.onerror = function(err) {
    cb(err);
  };

  img.src = URL.createObjectURL(file);
}

window.fileToCanvas = fileToCanvas;