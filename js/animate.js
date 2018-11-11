(function (global) {
  'use strict';

  function animate(render, duration, easing, callback) {
    duration = duration || 400;
    easing = easing ? animate.easings[easing] : animate.easings['linear'];
    var start = performance.now();
    requestAnimationFrame(function _animate(time) {
      var timeFraction = (time - start) / duration;
      var progress = easing(timeFraction);
      render(progress);
      if (timeFraction < 1) { requestAnimationFrame(_animate); }
      else {
        timeFraction = 1;
        typeof callback === 'function' && callback();
      }
    });
  }

  animate.makeEaseOut = function (easing) {
    return function (timeFraction) {
      return 1 - easing(1 - timeFraction);
    }
  };

  animate.makeEaseInOut = function (easing) {
    return function (timeFraction) {
      if (timeFraction < .5) { return easing(2 * timeFraction) / 2; }
      else { return (2 - easing(2 * (1 - timeFraction))) / 2; }
    }
  };

  animate.easings = {
    elasticity: 1.5,
    linear: function (timeFraction) { return timeFraction; },
    quadIn: function (timeFraction) { return Math.pow(timeFraction, 2) },
    circIn: function (timeFraction) { return 1 - Math.sin(Math.acos(timeFraction)) },
    backIn: function (timeFraction) {
      var x = animate.easings.elasticity; // x = 탄성 계수
      return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
    },
    bounceIn: function (timeFraction) {
      for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
      }
    },
    elasticIn: function (timeFraction) {
      var x = animate.easings.elasticity;
      return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
    }
  };

  animate.easings.quadOut = animate.makeEaseOut(animate.easings.quadIn);
  animate.easings.quadInOut = animate.makeEaseInOut(animate.easings.quadIn);
  animate.easings.circOut = animate.makeEaseOut(animate.easings.circIn);
  animate.easings.circInOut = animate.makeEaseInOut(animate.easings.circIn);
  animate.easings.backOut = animate.makeEaseOut(animate.easings.backIn);
  animate.easings.backInOut = animate.makeEaseInOut(animate.easings.backIn);
  animate.easings.bounceOut = animate.makeEaseOut(animate.easings.bounceIn);
  animate.easings.bounceInOut = animate.makeEaseInOut(animate.easings.bounceIn);
  animate.easings.elasticOut = animate.makeEaseOut(animate.easings.elasticIn);
  animate.easings.elasticInOut = animate.makeEaseInOut(animate.easings.elasticIn);

  global.animate = animate;

})(window);