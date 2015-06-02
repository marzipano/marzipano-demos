'use strict';

(function() {
  var eventEmitter = window.eventEmitter;

  var editMode = {
    get: getEditMode
  };

  eventEmitter(editMode);

  // Enable edit mode with key press
  var shiftPressed = false;
  var ctrlPressed = false;
  window.addEventListener('keydown', function(e) {
    var previousEditMode = getEditMode();
    if(e.keyCode === 16) { shiftPressed = true; }
    if(e.keyCode === 17) { ctrlPressed = true; }
    if(getEditMode() !== previousEditMode) {
      editMode.emit('changed');
    }
  });
  window.addEventListener('keyup', function(e) {
    var previousEditMode = getEditMode();
    if(e.keyCode === 16) { shiftPressed = false; }
    if(e.keyCode === 17) { ctrlPressed = false; }
    if(getEditMode() !== previousEditMode) {
      editMode.emit('changed');
    }
  });
  window.addEventListener('blur', function() {
    var previousEditMode = getEditMode();
    shiftPressed = false;
    ctrlPressed = false;
    if(getEditMode() !== previousEditMode) {
      editMode.emit('changed');
    }
  });

  function getEditMode() {
    if(shiftPressed) {
      return 'hide';
    }
    else if(ctrlPressed) {
      return 'show';
    }
    else {
      return false;
    }  
  }


  window.editMode = editMode;

})();