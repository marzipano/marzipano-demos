'use strict';

(function() {

function NullVideoElementWrapper(videoElement) {
  this._videoElement = videoElement;
}

NullVideoElementWrapper.prototype.videoElement = function() {
  return this._videoElement;
};

NullVideoElementWrapper.prototype.drawElement = function() {
  return this._videoElement;
};

NullVideoElementWrapper.prototype.destroy = function() {
  this._videoElement.pause();
  this._videoElement.volume = 0;
  this._videoElement.removeAttribute('src');
};

window.NullVideoElementWrapper = NullVideoElementWrapper;

})();