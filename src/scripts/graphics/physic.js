import bezier from 'cubic-bezier'

const timingFuncEpsilon = (1000 / 60) / 4

export const bazierFunc = {
  easeIn: bezier(0.42, 0, 1.0, 1.0, timingFuncEpsilon),
  ease: bezier(0.42, 0, 1.0, 0.8, timingFuncEpsilon),
  linear: bezier(0, 0, 1, 1, timingFuncEpsilon)
}

export class Physic {
  constructor (mesh, {
    x = 0, y = 0, z = 0,
    duration,
    animationFunc = bazierFunc.ease
  } = {}) {
    this.mesh = mesh
    this.current = {x, y, z}
    this.target = {x, y, z}

    // TODO: refactor this logic
    this.animation = {
      timeAnimationCompleted: {
        x: 0,
        y: 0,
        z: 0
      },
      duration: {
        x: duration,
        y: duration,
        z: duration
      },
      start: {x, y, z},
      func: {
        x: animationFunc,
        y: animationFunc,
        z: animationFunc
      }
    }

    for (let v of ['x', 'y', 'z']) {
      this['setPosition' + v.toUpperCase()] = (target) => this.setPosition(v, target)
      this['setAnimation' + v.toUpperCase()] = (func) => this.setAnimation(v, func)
    }
  }

  update (delta) {
    for (let v of ['x', 'y', 'z']) {
      this.animation.timeAnimationCompleted[v] += delta
      let part = this.animation.timeAnimationCompleted[v] / this.animation.duration[v]
      part = part > 1.0 ? 1.0 : part

      let c = this.animation.func[v](part)
      this.current[v] = (this.target[v] - this.animation.start[v]) * c + this.animation.start[v]

      this.mesh.position[v] = this.current[v]
    }
  }

  setAnimation (cor, func) {
    this.animation.pre[cor] = func
  }

  setPosition (cor, target) {
    this.target[cor] = target
    this.animation.start[cor] = this.current[cor]
    this.animation.timeAnimationCompleted[cor] = 0
  }
}
