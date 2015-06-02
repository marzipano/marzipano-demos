'use strict';

(function() {
  var multiResVideo = window.multiResVideo;

  multiResVideo.setResolutionIndex(1, function() {
    multiResVideo.element().play();
  });
})();