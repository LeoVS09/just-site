
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
  const wheel = {
    __upActions: [],
    __downActions: [],
    up (action) {
      this.__upActions.push(action)
      return this
    },
    down (action) {
      this.__downActions.push(action)
      return this
    }
  }

  function onWheel (e) {
    e = e || window.event
    let delta = e.deltaY || e.detail
    if (isOnMouseWheel) { delta = -e.wheelDelta }
    if (!delta) return

    if (delta > 0) {
      wheel.__downActions.forEach(action => action())
    } else {
      wheel.__upActions.forEach(action => action())
    }
  }

  return wheel
}
