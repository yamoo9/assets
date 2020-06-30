/**
 * loadScript
 * @summary 스크립트 파일을 동적으로 로드하는 유틸리티 함수
 * @param {String} source 스크립트 리소스 URL
 * @param {Function} callback 로드 완료 시점에 콜백 될 함수
 */
function loadScript(source, callback) {
  var s = null;
  
  if (source && typeof source === 'string') {
    s = document.createElement('script');
    s.setAttribute('src', source);
    document.body.appendChild(s);
  }
  
  if (s && typeof callback === 'function') {
    s.addEventListener('load', callback);
  }
}


/**
 * loadScripts
 * @summary 스크립트 파일(들)을 동적으로 로드하는 유틸리티 함수
 * @param {Array} list 스크립트 리소스 URL 집합(배열)
 * @param {Function} callback 모든 리소스가 로드 완료된 시점에 콜백 될 함수
 */
function loadScripts(list, callback) {
  var _list = list.slice().map(function(item) {
    return {
      url: item,
      complete: false
    }
  });

  _list.forEach(function(item) {
    loadScript(item.url, function() {
      item.complete = true;
    });
  });

  var clearId = window.setInterval(function() {
    var allCompleted = _list.every(function(item) {
      return item.complete === true;
    });
    if (allCompleted) {
      window.clearInterval(clearId);
      typeof callback === 'function' && callback();
    }
  }, 100);
}