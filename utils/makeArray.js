/**
 * makeArray
 * @param {arguments|NodeList} likeArray 유사 배열 객체
 * @returns {Array} 배열로 변경된 객체
 */
function makeArray(likeArrayObject) {
  return [].slice.call(likeArrayObject);
}