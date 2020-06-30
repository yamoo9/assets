/**
 * isType
 * @summary JavaScript 데이터 타입을 문자값으로 반환하는 유틸리티 함수
 * @param {any} data 모든 데이터 타입
 * @returns {String} 데이터 타입(문자)
 */
function isType(data) {
  return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
}