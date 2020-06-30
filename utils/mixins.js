/**
 * mixins
 * @summary 객체 합성 유틸리티 함수
 * @params {Arguments} arguments 함수 인자 집합
 * @returns {Object} 합성된 객체
 */
function mixins() {
  var args = [].slice.call(arguments);
  var deepModeIndex = -1;
  var isDeep = args.some(function(arg, index) {
    var checkMode = typeof arg === 'boolean';
    if (checkMode) { deepModeIndex = index; }
    return checkMode;
  });

  if (isDeep) { args.splice(deepModeIndex, 1); }

  var mixer = args[0];
  var objList = args.slice(1);

  return objList.reduce(function(combiner, o) {
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        var value = o[key];
        if (isDeep) {
          if (value && value.constructor === Object) {
            combiner[key] = mixins({}, combiner[key], value);
          } 
          else if (value && value.constructor === Array) {
            combiner[key] = combiner[key] ? combiner[key].concat(value) : value;
          } else {
            combiner[key] = value;
          }
        } else {
          combiner[key] = value;
        }
      }
    }

    return combiner;
  }, mixer);

}