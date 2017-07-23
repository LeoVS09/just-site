
const fadeNav = tag => () => {
  let offset = getOffset(document.getElementsByClassName(tag)[0])
  let nav = document.getElementsByTagName('nav')[0]
  if (getScrollXY().y > offset.top) { nav.classList.add('scrolled') } else { nav.classList.remove('scrolled') }
}

function getScrollXY () {
  let x = 0
  let y = 0
  if (typeof (window.pageYOffset) === 'number') {
    // Netscape compliant
    y = window.pageYOffset
    x = window.pageXOffset
  } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
    // DOM compliant
    y = document.body.scrollTop
    x = document.body.scrollLeft
  } else if (document.documentElement && (document.documentElement.scrollLeft ||
        document.documentElement.scrollTop)) {
    // IE6 standards compliant mode
    y = document.documentElement.scrollTop
    x = document.documentElement.scrollLeft
  }

  return { x, y }
}

function getOffset (elem) {
  if (elem.getBoundingClientRect) {
    // "правильный" вариант
    return getOffsetRect(elem)
  } else {
    // пусть работает хоть как-то
    return getOffsetSum(elem)
  }
}

function getOffsetSum (elem) {
  let top = 0
  let left = 0
  while (elem) {
    top = top + parseInt(elem.offsetTop)
    left = left + parseInt(elem.offsetLeft)
    elem = elem.offsetParent
  }

  return { top, left }
}

function getOffsetRect (elem) {
  let box = elem.getBoundingClientRect()

  let body = document.body
  let docElem = document.documentElement

  let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
  let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

  let clientTop = docElem.clientTop || body.clientTop || 0
  let clientLeft = docElem.clientLeft || body.clientLeft || 0

  let top = box.top + scrollTop - clientTop
  let left = box.left + scrollLeft - clientLeft

  return {
    top: Math.round(top),
    left: Math.round(left)
  }
}
export default tag =>
  window.addEventListener('scroll', fadeNav(tag))
