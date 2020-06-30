/**
 * loadStyle
 * @summary 스타일 파일을 동적으로 로드하는 유틸리티 함수
 * @param {String} source 스타일 리소스 URL
 * @param {Function} callback 로드 완료 시점에 콜백 될 함수
 */
function loadStyle(source, callback) {
  var s = null;

  if (source && typeof source === 'string') {
    s = document.createElement('link');
    s.setAttribute('href', source);
    s.setAttribute('rel', 'stylesheet');
    document.head.appendChild(s);
  }
  
  if (s && typeof callback === 'function') {
    s.addEventListener('load', callback);
  }
}