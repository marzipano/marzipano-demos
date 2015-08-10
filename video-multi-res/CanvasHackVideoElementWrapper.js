'use strict';

(function() {

function CanvasHackVideoElementWrapper(videoElement) {
  this._videoElement = videoElement;
  this._drawElement = document.createElement('canvas');
}

CanvasHackVideoElementWrapper.prototype.videoElement = function() {
  return this._videoElement;
};

CanvasHackVideoElementWrapper.prototype.drawElement = function() {
  this._drawElement.width = this._videoElement.videoWidth;
  this._drawElement.height = this._videoElement.videoHeight;
  this._drawElement.getContext("2d").drawImage(this._videoElement, 0, 0);
  return this._drawElement;
};

CanvasHackVideoElementWrapper.prototype.destroy = function() {
  this._videoElement.pause();
  this._videoElement.volume = 0;
  this._videoElement.removeAttribute('src');
};

window.CanvasHackVideoElementWrapper = CanvasHackVideoElementWrapper;

})();