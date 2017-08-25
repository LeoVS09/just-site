
let isUndefined = a => typeof a === 'undefined'

export default function (elem, {
  perspective = 1000,
  start = 0,
  step = 1,
  end = perspective,
  units = 'px',
  beginSet = true
} = {}) {

  function calcMoveAway (current) {
    let newValue = current - step
    return (newValue <= 0) ? 0 : newValue
  }

  function calcComeUp (current) {
    let newValue = current + step
    return (newValue >= end) ? end : newValue
  }

  let view = {
    setTransformZ (z) {
      elem.style.transform = `perspective(${perspective}${units}) translateZ(${z}${units})`
    },
    getTransformZ () {
      let transform = elem.style.transform
      let indexStart = transform.indexOf('translateZ(')
      return +transform.slice(indexStart + 11, transform.indexOf(units + ')', indexStart))
    },
    moveAway (newStep) {
      if (!isUndefined(newStep)) { step = newStep }
      this.setTransformZ(calcMoveAway(this.getTransformZ()))
    },
    comeUp (newStep) {
      if (!isUndefined(newStep)) { step = newStep }
      this.setTransformZ(calcComeUp(this.getTransformZ()))
    }
  }
  if (beginSet) { view.setTransformZ(start) }
  return view
}
