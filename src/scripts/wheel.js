import { EventEmitter } from './utils'

// Mouse wheel event api

export default function (elem = window) {
  let isOnMouseWheel = false
  if (elem.addEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      elem.addEventListener('wheel', onWheel)
    } else if ('onmousewheel' in document) {
      // legacy variant
      isOnMouseWheel = true
      elem.addEventListener('mousewheel', onWheel)
    } else {
      // Firefox < 17
      elem.addEventListener('MozMousePixelScroll', onWheel)
    }
  } else { // IE8-
    isOnMouseWheel = true
    elem.attachEvent('onmousewheel', onWheel)
  }
  const wheel = new EventEmitter(['up','down'])

  function onWheel (e) {
    e = e || window.event
    let delta = e.deltaY || e.detail
    if (isOnMouseWheel) { delta = -e.wheelDelta }
    if (!delta) return

    if (delta > 0) {
      wheel.emit('down')
    } else {
      wheel.emit('up')
    }
  }

  return wheel
}
