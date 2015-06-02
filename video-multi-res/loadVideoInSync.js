'use strict';

(function() {

// Attempts to load a video element in sync with another video element
function loadVideoInSync(url, syncElement, cb) {
  cb = once(cb);
  var element = document.createElement('video');
  element.crossOrigin = 'anonymous';

  element.onerror = function(e) {
    cb(e.target.error);
  };

  // The new video will be loaded at currentTime + 5s, to allow time for
  // the video to be ready to play
  var syncTime = 5000;

  element.src = url;

  // Checking readyState on an interval seems to be more reliable than using events
  waitForReadyState(element, element.HAVE_CURRENT_DATA, 0.2, function() {


    if(syncElement) {
      if(syncElement.paused) {
        // If the video is not playing, we can load the new one to the correct time
        element.currentTime = syncElement.currentTime;
      }
      else {
        //If it is playing, we will need to load to a time ahead of the current,
        // to account for the time that the loading will take
        element.currentTime = syncElement.currentTime + syncTime / 1000;
      }
    }

    waitForReadyState(element, element.HAVE_ENOUGH_DATA, 0.2, function() {

      if(!syncElement) {
        // If there is no element to sync with we are done
        cb(null, element);
      }
      else if(syncElement.paused) {
        // If the element to sync with is paused, we are done
        cb(null, element);
      }
      else {      
        if(element.currentTime <= syncElement.currentTime) {
          // The loading took too long, start playing immediately
          // We will be a bit out of sync
          element.play();
          cb(null, element);
        }
        else {
          // If the loading was too fast, wait before playing
          // We should be in sync
          setTimeout(function() {
            element.play();
            cb(null, element);
          }, (element.currentTime - syncElement.currentTime) * 1000);
        }
      }
    });
  });
}

function waitForReadyState(element, readyState, interval, callback) {
  var timer = setInterval(function() {
    if(element.readyState >= readyState) {
      clearInterval(timer);
      callback(null, true);
    }
  }, interval);
}

function once(f) {
  var called = false;
  return function() {
    if(!called) {
      called = true;
      f.apply(null, arguments);
    }
  };
}

window.loadVideoInSync = loadVideoInSync;

})();