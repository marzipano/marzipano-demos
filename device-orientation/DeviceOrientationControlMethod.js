'use strict';

var Marzipano = window.Marzipano;

var Dynamics = Marzipano.Dynamics;
var eventEmitter = Marzipano.util.eventEmitter;
var degToRad = Marzipano.util.degToRad;

function DeviceOrientationControlMethod(opts) {
  this._dynamics = {
    yaw: new Dynamics(),
    pitch: new Dynamics()
  };

  this._deviceOrientationHandler = this._handleData.bind(this);

  if (window.DeviceOrientationEvent) {
     window.addEventListener('deviceorientation', this._deviceOrientationHandler);
  }

  this._previous = {};

  this._getPitchCallbacks = [];
}

eventEmitter(DeviceOrientationControlMethod);


DeviceOrientationControlMethod.prototype.destroy = function() {
  this._dynamics = null;
};

DeviceOrientationControlMethod.prototype.getPitch = function(cb) {
  this._getPitchCallbacks.push(cb);
}


var doEuler = {};
var euler = {};
DeviceOrientationControlMethod.prototype._handleData = function(data) {
  doEuler.yaw = degToRad(data["alpha"]);
  doEuler.pitch = degToRad(data["beta"]);
  doEuler.roll = degToRad(data["gamma"]);

  rotateEuler(doEuler, euler);

  // Callback getPitch
  this._getPitchCallbacks.forEach(function(callback) {
    callback(null, euler.pitch);
  });
  this._getPitchCallbacks.length = 0;

  // Emit offsets
  if(this._previous.yaw != null && this._previous.pitch != null && this._previous.roll != null) {
    this._dynamics.yaw.offset = -(euler.yaw - this._previous.yaw);
    this._dynamics.pitch.offset = (euler.pitch - this._previous.pitch);

    this.emit('parameterDynamics', 'yaw', this._dynamics.yaw);
    this.emit('parameterDynamics', 'pitch', this._dynamics.pitch);
  }

  this._previous.yaw = euler.yaw;
  this._previous.pitch = euler.pitch;
  this._previous.roll = euler.roll;
};

// Taken from krpano's gyro plugin by Aldo Hoeben
// https://github.com/fieldOfView/krpano_fovplugins/tree/master/gyro/
function rotateEuler(euler, result)
  {
    // This function is based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
    // and http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm

    var heading, bank, attitude,
      ch = Math.cos(euler.yaw),
      sh = Math.sin(euler.yaw),
      ca = Math.cos(euler.pitch),
      sa = Math.sin(euler.pitch),
      cb = Math.cos(euler.roll),
      sb = Math.sin(euler.roll),

      matrix = [
        sh*sb - ch*sa*cb,   -ch*ca,    ch*sa*sb + sh*cb,
        ca*cb,              -sa,      -ca*sb,
        sh*sa*cb + ch*sb,    sh*ca,   -sh*sa*sb + ch*cb
      ]; // Note: Includes 90 degree rotation around z axis

    /* [m00 m01 m02] 0 1 2
     * [m10 m11 m12] 3 4 5
     * [m20 m21 m22] 6 7 8 */

    if (matrix[3] > 0.9999)
    {
      // Deal with singularity at north pole
      heading = Math.atan2(matrix[2],matrix[8]);
      attitude = Math.PI/2;
      bank = 0;
    }
    else if (matrix[3] < -0.9999)
    {
      // Deal with singularity at south pole
      heading = Math.atan2(matrix[2],matrix[8]);
      attitude = -Math.PI/2;
      bank = 0;
    }
    else
    {
      heading = Math.atan2(-matrix[6],matrix[0]);
      bank = Math.atan2(-matrix[5],matrix[4]);
      attitude = Math.asin(matrix[3]);
    }

    result.yaw = heading;
    result.pitch = attitude;
    result.roll = bank;
  }

window.DeviceOrientationControlMethod = DeviceOrientationControlMethod;