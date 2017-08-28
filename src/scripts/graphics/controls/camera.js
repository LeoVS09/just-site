import * as THREE from 'three'

export class Camera {
  rollSpeed = 0.5
  autoForward = false
  moveState = {
    pitchUp: 0,
    pitchDown: 0,
    yawLeft: 0,
    yawRight: 0,
    rollLeft: 0,
    rollRight: 0
  }
  rotationVector = new THREE.Vector3(0, 0, 0)

  constructor (object, domElement, angle = 0.05) {
    this.object = object
    this.rollAngle = angle

    this.domElement = (domElement !== undefined) ? domElement : document
    if (domElement) this.domElement.setAttribute('tabindex', -1)

    this.domElement.addEventListener('contextmenu', this.contextmenu, false)

    this.domElement.addEventListener('mousemove', this.mousemove.bind(this), false)

    this.updateRotationVector()
  }

  mousemove (event) {
    let container = this.getContainerDimensions()
    let halfWidth = container.size[0] / 2
    let halfHeight = container.size[1] / 2

    this.moveState.yawLeft = -((event.pageX - container.offset[0]) - halfWidth) / halfWidth
    this.moveState.pitchDown = ((event.pageY - container.offset[1]) - halfHeight) / halfHeight

    this.updateRotationVector()
  }

  update (delta) {
    // TODO: add bazier timing function speed
    // let rotMult = delta

    let calc = (last, next) => (next - last) * delta + last
    // expose the rotation vector for convenience
    this.object.rotation.set(
      calc(this.object.rotation.x, this.rotationVector.x),
      calc(this.object.rotation.y, this.rotationVector.y),
      calc(this.object.rotation.z, this.rotationVector.z),
    )
  }

  updateRotationVector () {
    this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp) * this.rollAngle
    this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft) * this.rollAngle
    this.rotationVector.z = 0

    // console.log('rotate:', this.rotationVector)
  }

  getContainerDimensions () {
    if (this.domElement !== document) {
      return {
        size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
        offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
      }
    } else {
      return {
        size: [window.innerWidth, window.innerHeight],
        offset: [0, 0]
      }
    }
  }

  static contextmenu (event) {
    event.preventDefault()
  }

  dispose () {
    this.domElement.removeEventListener('contextmenu', this.contextmenu, false)
    this.domElement.removeEventListener('mousemove', this.mousemove.bind(this), false)
  }
}
