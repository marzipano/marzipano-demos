function linear(val) { return val; }

var transitionUpdateFunctions = {
  
  opacity: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ opacity: val });
    }
  },


  fromRight: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ rect: { relativeX: 1 - val }});
    }
  },


  fromTop: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ rect: { relativeY: -1 + val }});
    }
  },
  

  fromBottom: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ rect: { relativeY: 1 - val }});
    }
  },


  width: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ rect: { relativeWidth: val }});
    }
  },


  fromCenter: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      val = ease(val);
      newScene.layer().setEffects({ rect: {
        relativeWidth: val,
        relativeHeight: val,
        relativeX: 0.5 - val / 2,
        relativeY: 0.5 - val / 2
      }});
    }
  },


  fromCenterAndOpacity: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      eased = ease(val);
      newScene.layer().setEffects({ rect: {
        relativeWidth: eased,
        relativeHeight: eased,
        relativeX: 0.5 - eased / 2,
        relativeY: 0.5 - eased / 2
      },
      opacity: val });
    }
  },


  fromTopAndOpacity: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      var eased = ease(val);
      newScene.layer().setEffects({ opacity: val, rect: { relativeY: -1 + eased }});
    }
  },

  fromWhite: function(ease) {
    ease = ease || linear;
    return function(val, newScene) {
      var eased = ease(val);
      newScene.layer().setEffects({ colorOffset: [ 1-val, 1-val, 1-val, 0 ] });
    }
  },


  throughBlack: function(ease) {
    ease = ease || linear;
    return function(val, newScene, oldScene) {
      var eased = ease(val);
      var offset;

      if(eased < 0.5) {
        offset = eased * 2;
        newScene.layer().setEffects({ opacity: 0 });
        oldScene.layer().setEffects({ colorOffset: [ -offset, -offset, -offset, 0 ] })
      }
      else {
        offset = 1 - ((eased - 0.5) * 2);
        newScene.layer().setEffects({ opacity: 1, colorOffset: [ -offset, -offset, -offset, 0 ] })
      }
    }
  }

};

window.transitionUpdateFunctions = transitionUpdateFunctions;