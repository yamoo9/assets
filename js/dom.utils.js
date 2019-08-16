/**
 * DOM Utilities, @yamoo9
 */

// HTML 요소 또는 요소 리스트를 찾는 함수
const el = (selector, context = document) => context.querySelector(selector)
const elList = (selector, context = document) => context.querySelectorAll(selector)

// HTMLElement 확장
Object.assign(HTMLElement.prototype, {
	find(selector) {
		return this.querySelector(selector)
	},
	findAll(selector = '*') {
		return this.querySelectorAll(selector)
	},
	findChildren(selector = '*') {
		return [].filter.call(this.children, (child) => child.matches(selector))
	},
	html(innerCode) {
		if (!innerCode) {
			return this.innerHTML
		} else {
			this.innerHTML = innerCode
		}
	},
	on(type, handler, capture = false) {
		this.addEventListener(type, handler, capture)
	},
	off(type, handler, capture = false) {
		this.addEventListener(type, handler, capture)
	},
})
