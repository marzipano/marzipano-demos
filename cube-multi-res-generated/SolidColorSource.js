'use strict';

(function() {
  var StaticCanvasAsset = window.Marzipano.StaticCanvasAsset;

  function SolidColorSource(width, height, textFromTileFun, colorFromTileFun, textColorFromTileFun) {
    textFromTileFun = textFromTileFun || function(tile) {
      var components = [];
      if(tile.face) { components.push("face:" + tile.face); }
      components.push("x:" + tile.x);
      components.push("y:" + tile.y);
      components.push("zoom:" + tile.z);

      return components.join(" ");
    };

    colorFromTileFun = colorFromTileFun || function(tile) {
      if(tile.face) {
        if(tile.face == 'u') { return "#999"; }
        if(tile.face == 'b') { return "#aaa"; }
        if(tile.face == 'd') { return "#bbb"; }
        if(tile.face == 'f') { return "#ccc"; }
        if(tile.face == 'r') { return "#ddd"; }
        if(tile.face == 'l') { return "#eee"; }
      }
      return "#ddd";
    };
    textColorFromTileFun = textColorFromTileFun || function() { return "#000"; };

    this._width = width;
    this._height = height;
    this._textFromTileFun = textFromTileFun;
    this._colorFromTileFun = colorFromTileFun;
    this._textColorFromTileFun = textColorFromTileFun;
  }

  SolidColorSource.prototype.loadAsset = function(stage, tile, done) {
    // loadAsset() must return a cancel() function which also calls `done`
    var width = this._width;
    var height = this._height;
    var text = this._textFromTileFun(tile);
    var color = this._colorFromTileFun(tile);
    var textColor = this._textColorFromTileFun(tile);

    var element = getCanvas(width, height);

    // Tile background
    var ctx = element.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Border around the tile
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(0, 0, width, height);


    // Text
    ctx.fillStyle = textColor;
    ctx.font = width/20 + "px Arial";
    ctx.textAlign=  "center"; 
    ctx.fillText(text, width/2, height/2);

    // loadAsset() must be asynchronous
    var timeout = setTimeout(function() {
      var asset = new StaticCanvasAsset(element);
      done(null, tile, asset);
    }, 0);

    // cancel() function to return
    function cancel() {
      clearTimeout(timeout);
      done.apply(null, arguments);
    }

    return cancel;
  };


  function getCanvas(width, height) {
    if(typeof document !== 'undefined') {
      var element = document.createElement("canvas");
      element.width = width;
      element.height = height;
      return element;
    }
    else {
      var _nodeRequire = require;
      var Canvas = _nodeRequire('canvas');
      var canvas = new Canvas(width,height);
      return canvas;
    }
  }

  window.SolidColorSource = SolidColorSource;
})();