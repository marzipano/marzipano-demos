'use strict';

// Anaglyph types from http://www.3dtv.at/knowhow/anaglyphcomparison_en.aspx
(function() {
  var Marzipano = window.Marzipano;

  // Luminance values for anaglyph effects
  var lumR = 0.3086;
  var lumG = 0.6094;
  var lumB = 0.0820;

  function gray() {
    var redEffects = Marzipano.colorEffects.empty();
    var redMatrix = redEffects.colorMatrix;

    redMatrix[0] = lumR;
    redMatrix[1] = lumG;
    redMatrix[2] = lumB;
    redMatrix[3] = 0;

    redMatrix[4] = 0;
    redMatrix[5] = 0;
    redMatrix[6] = 0;
    redMatrix[7] = 0;

    redMatrix[8] = 0;
    redMatrix[9] = 0;
    redMatrix[10] = 0;
    redMatrix[11] = 0;

    redMatrix[12] = 0;
    redMatrix[13] = 0;
    redMatrix[14] = 0;
    redMatrix[15] = 1;

    var blueEffects = Marzipano.colorEffects.empty();
    var blueMatrix = blueEffects.colorMatrix;

    blueMatrix[0] = 0;
    blueMatrix[1] = 0;
    blueMatrix[2] = 0;
    blueMatrix[3] = 0;

    blueMatrix[4] = lumR;
    blueMatrix[5] = lumG;
    blueMatrix[6] = lumB;
    blueMatrix[7] = 0;

    blueMatrix[8] = lumR;
    blueMatrix[9] = lumG;
    blueMatrix[10] = lumB;
    blueMatrix[11] = 0;

    blueMatrix[12] = 0;
    blueMatrix[13] = 0;
    blueMatrix[14] = 0;
    blueMatrix[15] = 1;

    return { red: redEffects, blue: blueEffects };
  }

  function color() {
    var redEffects = Marzipano.colorEffects.empty();
    var redMatrix = redEffects.colorMatrix;

    redMatrix[0] = 1;
    redMatrix[1] = 0;
    redMatrix[2] = 0;
    redMatrix[3] = 0;

    redMatrix[4] = 0;
    redMatrix[5] = 0;
    redMatrix[6] = 0;
    redMatrix[7] = 0;

    redMatrix[8] = 0;
    redMatrix[9] = 0;
    redMatrix[10] = 0;
    redMatrix[11] = 0;

    redMatrix[12] = 0;
    redMatrix[13] = 0;
    redMatrix[14] = 0;
    redMatrix[15] = 1;

    var blueEffects = Marzipano.colorEffects.empty();
    var blueMatrix = blueEffects.colorMatrix;

    blueMatrix[0] = 0;
    blueMatrix[1] = 0;
    blueMatrix[2] = 0;
    blueMatrix[3] = 0;

    blueMatrix[4] = 0;
    blueMatrix[5] = 1;
    blueMatrix[6] = 0;
    blueMatrix[7] = 0;

    blueMatrix[8] = 0;
    blueMatrix[9] = 0;
    blueMatrix[10] = 1;
    blueMatrix[11] = 0;

    blueMatrix[12] = 0;
    blueMatrix[13] = 0;
    blueMatrix[14] = 0;
    blueMatrix[15] = 1;

    return { red: redEffects, blue: blueEffects };
  }

  function halfcolor() {
    var redEffects = Marzipano.colorEffects.empty();
    var redMatrix = redEffects.colorMatrix;

    redMatrix[0] = lumR;
    redMatrix[1] = lumG;
    redMatrix[2] = lumB;
    redMatrix[3] = 0;

    redMatrix[4] = 0;
    redMatrix[5] = 0;
    redMatrix[6] = 0;
    redMatrix[7] = 0;

    redMatrix[8] = 0;
    redMatrix[9] = 0;
    redMatrix[10] = 0;
    redMatrix[11] = 0;

    redMatrix[12] = 0;
    redMatrix[13] = 0;
    redMatrix[14] = 0;
    redMatrix[15] = 1;

    var blueEffects = Marzipano.colorEffects.empty();
    var blueMatrix = blueEffects.colorMatrix;

    blueMatrix[0] = 0;
    blueMatrix[1] = 0;
    blueMatrix[2] = 0;
    blueMatrix[3] = 0;

    blueMatrix[4] = 0;
    blueMatrix[5] = 1;
    blueMatrix[6] = 0;
    blueMatrix[7] = 0;

    blueMatrix[8] = 0;
    blueMatrix[9] = 0;
    blueMatrix[10] = 1;
    blueMatrix[11] = 0;

    blueMatrix[12] = 0;
    blueMatrix[13] = 0;
    blueMatrix[14] = 0;
    blueMatrix[15] = 1;

    return { red: redEffects, blue: blueEffects };
  }

  function optimized() {
    var redEffects = Marzipano.colorEffects.empty();
    var redMatrix = redEffects.colorMatrix;

    redMatrix[0] = 0;
    redMatrix[1] = 0.7;
    redMatrix[2] = 0.3;
    redMatrix[3] = 0;

    redMatrix[4] = 0;
    redMatrix[5] = 0;
    redMatrix[6] = 0;
    redMatrix[7] = 0;

    redMatrix[8] = 0;
    redMatrix[9] = 0;
    redMatrix[10] = 0;
    redMatrix[11] = 0;

    redMatrix[12] = 0;
    redMatrix[13] = 0;
    redMatrix[14] = 0;
    redMatrix[15] = 1;

    var blueEffects = Marzipano.colorEffects.empty();
    var blueMatrix = blueEffects.colorMatrix;

    blueMatrix[0] = 0;
    blueMatrix[1] = 0;
    blueMatrix[2] = 0;
    blueMatrix[3] = 0;

    blueMatrix[4] = 0;
    blueMatrix[5] = 1;
    blueMatrix[6] = 0;
    blueMatrix[7] = 0;

    blueMatrix[8] = 0;
    blueMatrix[9] = 0;
    blueMatrix[10] = 1;
    blueMatrix[11] = 0;

    blueMatrix[12] = 0;
    blueMatrix[13] = 0;
    blueMatrix[14] = 0;
    blueMatrix[15] = 1;

    return { red: redEffects, blue: blueEffects };
  }


  window.colorTransformEffects = {
    gray: gray,
    color: color,
    halfcolor: halfcolor,
    optimized: optimized
  };

})();