
let isUndefined = a => typeof a === 'undefined'

export default function (elem, {perspective, start, step, end, units = 'px', beginSet = true} = {}) {
  perspective = isUndefined(perspective) ? 1000 : perspective
  start = isUndefined(start) ? 0 : start
  step = isUndefined(step) ? 1 : step
  end = isUndefined(end) ? perspective : end

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
