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

/* ------------------------------------------------------------------------------------- */

// classList - IE 호환을 위한 라이브러리 동적 로드
// 참고: https://github.com/eligrey/classList.js
loadScripts(
  [
    '//cdn.jsdelivr.net/npm/eligrey-classlist-js-polyfill@1.2.20171210/classList.min.js',
    '//yamoo9.github.io/assets/ui/Toast/Toast.css',
    '//yamoo9.github.io/assets/utils/loadStyle.js',
    '//yamoo9.github.io/assets/utils/mixins.js',
  ],
  ToastComponent
);

/**
 * @module ToastComponent
 */
function ToastComponent() {
  'use strict';

  // Toast 스타일 로드
  loadStyle('//yamoo9.github.io/assets/ui/Toast/Toast.css');

  /**
   * Toast 컴포넌트 생성자 함수(클래스 역할)
   * @class
   * @param {Object} options 사용자 정의 옵션(객체)
   */
  function Toast(options) {
    // 옵션 객체 합성
    this._config = mixins({}, Y.toast.defaultOptions, options);

    // DOM 노드
    this._toastZoneNode = null;
    this._toastNode = null;

    // 토스트 생성 (초기화)
    this.create();
  }

  /**
   * 기본 옵션(Default Options)
   * @static
   */
  Toast.defaultOptions = {
    // 초기 표시 여부
    initVisible: true,
    // 자동 감춤 처리
    // ⚠️ 자동으로 감출 경우, 접근성 문제 야기하므로 주의
    autoHide: false,
    // 자동 감춤 처리 시간
    autoHideTime: 3000,
    // Toast 바디(body) 사용자 정의 마크업 콘텐츠
    html: 'Toast 컴포넌트 내용',
    // Toast에 추가할 클래스 속성 이름
    classes: '',
    // Toast 표시 지연 시간
    delay: 100,
    // Toast가 나타나면 콜백되는 함수
    onOpen: null,
    // Toast가 사라진 후 콜백되는 함수
    onClose: null,
  };

  /**
   * Toast 템플릿(Template)
   * @static
   */
  Toast.template = [
    '<div class="toast">\
      <div class="toast__content"></div>\
      <button type="button" class="toast__closeButton" aria-label="닫기">×</button>\
    </div >\
    ',
  ];

  /**
   * Toast 컴포넌트 초기화 메서드
   * @memberof Toast.prototype
   */
  Toast.prototype.create = function() {
    // 문서에서 <div id="toastZone"></div> 요소를 찾아 참조
    this._toastZoneNode = document.querySelector('#toastZone');

    // <div id="toastZone"></div> 요소가 존재할 경우
    if (this._toastZoneNode) {
      // #toastZone 요소 영역의 뒷부분에 Toast.template 템플릿 HTML 코드를 추가
      // ⚠️ insertAdjacentHTML() 메서드 - IE 9+
      this._toastZoneNode.insertAdjacentHTML('beforeend', Toast.template);

      // #toastZone 안에서 .toast 요소들을 찾아 참조
      var toastNodeList = this._toastZoneNode.querySelectorAll('.toast');
      // Toast 인스턴스의 _toastNode에 마지막 .toast 요소노드 참조
      this._toastNode = toastNodeList[toastNodeList.length - 1];
      // .toast__content 요소 노드의 HTML 코드로 html 옵션 설정
      this._toastNode.querySelector('.toast__content').innerHTML = this._config.html;
      // .toast__closeButton 요소 노드 이벤트 연결: Toast 닫기
      this._toastNode.querySelector('.toast__closeButton').addEventListener('click', this.close.bind(this));

      // 초기 표시(init visible) 옵션 값이 설정된 경우, Toast 표시(열기)
      this._config.initVisible && this.open();
      // 클래스 이름 옵션이 추가된 경우, 클래스 이름 추가
      this._config.classes && this._toastNode.classList.add(this._config.classes);
    }
    // <div id="toastZone"></div> 요소가 존재하지 않을 경우
    else {
      // 경고 메시지 출력
      console.warn('경고!\n문서에 <div id="toastZone"></div> 요소가 존재하지 않습니다.\n해당 요소가 존재하는지 확인 후 다시 시도해보세요.');
    }
  };

  /**
   * Toast 컴포넌트 화면에 표시하는 메서드
   * @memberof Toast.prototype
   */
  Toast.prototype.open = function() {
    // Toast {} 인스턴스 참조
    var _this = this;
    // Toast {} 인스턴스 옵션 참조
    var _config = this._config;
    // Toast {} 인스턴스의 _toastNode 참조
    var _toastNode = this._toastNode;

    // 지연(delay) 옵션 뒤에 Toast 표시
    window.setTimeout(function() {
      _toastNode.classList.add('open');
      // onOpen 옵션이 함수로 설정된 경우, 콜백 실행
      typeof _config.onOpen === 'function' && _config.onOpen();
    }, _config.delay);

    // 자동 감춤(auto hide) 설정된 경우
    if (_config.autoHide) {
      // 자동 감춤 시간 + 지연 시간 뒤에 Toast 닫기 실행
      window.setTimeout(this.close.bind(this), _config.autoHideTime + _config.delay);
    }
  };

  /**
   * Toast 컴포넌트 화면에서 감추는 메서드
   * @memberof Toast.prototype
   */
  Toast.prototype.close = function() {
    var _this = this;
    var _config = this._config;
    this._toastNode.classList.remove('open');

    window.setTimeout(function() {
      _this.destroy(); // 파괴
      typeof _config.onClose === 'function' && _config.onClose();
    }, 500);
  };

  /**
   * Toast 컴포넌트 파괴(제거) 메서드
   * @memberof Toast.prototype
   */
  Toast.prototype.destroy = function() {
    var _toastNode = this._toastNode;
    _toastNode.parentNode.removeChild(_toastNode);
  };

  /** 
   * Y 네임스페이스(객체)
   * @namespace
   */
  window.Y = window.Y || {};
  var Y = window.Y;

  /** 
   * Toast 생성 유틸리티 함수
   * @memberof Y
   * @static
   * @function
   */
  Y.toast = function(options) {
    // 함수가 실행되면 새로운 Toast 객체 생성 후, 반환
    return new Toast(options);
  };

  /** 
   * Toast 리스트 생성 유틸리티 함수
   * @memberof Y
   * @static
   * @function
   */
  Y.toastList = function(optionsList) {
    // optionsList 순환하여 새로운 배열 반환
    return optionsList.map(function(options) {
      // 새로운 Toast 객체 생성 후, 반환
      return new Toast(options);
    });
  };

  // Toast 컴포넌트 기본 옵션 할당 (모듈 밖에서 접근 가능)
  Y.toast.defaultOptions = Toast.defaultOptions;

  // END
}
