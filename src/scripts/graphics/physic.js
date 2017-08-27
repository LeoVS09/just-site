
const defaultAnimationDuration = 1 // in seconds

export class Physic {
  constructor (mesh, {x = 0, y = 0, z = 0, duration = defaultAnimationDuration} = {}) {
    this.mesh = mesh
    this.current = {x, y, z}
    this.target = {x, y, z}
    // TODO: refactor this logic
    this.animation = {
      pre: {
        x: linearStep,
        y: linearStep,
        z: linearStep
      },
      duration: {
        x: duration,
        y: duration,
        z: duration
      },
      step: {
        x: 0,
        y: 0,
        z: 0
      },
      func: {
        x: linearTick,
        y: linearTick,
        z: linearTick
      }
    }

    for (let v of ['x', 'y', 'z']) {
      this['setPosition' + v.toUpperCase()] = (target) => this.setPosition(v, target)
      this['setAnimation' + v.toUpperCase()] = (func) => this.setAnimation(v, func)
    }
  }

  tick (delta) {
    for (let v of ['x', 'y', 'z']) {
      this.current[v] = this.animation.func[v](this.current[v], this.target[v], delta, this.animation.step[v])
      this.mesh.position[v] = this.current[v]
    }
  }

  setAnimation (cor, func) {
    this.animation.pre[cor] = func
  }

  setPosition (cor, target) {
    this.target[cor] = target
    this.animation.step[cor] = this.animation.pre[cor](this.current[cor], target, this.animation.duration[cor])
  }
}

export function linearStep (current, target, duration) {
  return (target - current) / duration
}

export function linearTick (current, target, delta, step) {
  if (step === 0) {
    return current
  }

  current += step * delta
  if (step > 0) {
    if (current >= target) { return target }
  } else {
    if (current <= target) { return target }
  }
  return current
}
