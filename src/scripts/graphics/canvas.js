import '../../canvas.styl'
import { Physic } from './physic'
import * as THREE from 'three'

export class GraphicEngine {
  positionOfCamera = 1000
  AngleOfCamera = 60
  BackgroundSizeX = 1920
  BackgroundSizeY = 1200
  physicObjects = []

  calcCameraProps () {
    // calculating max z offset of camera
    this.cameraRatio = window.innerWidth / window.innerHeight
    let maxCameraZPositionY = this.BackgroundSizeY / (2 * Math.tan((this.AngleOfCamera / 2) * Math.PI / 180))
    let maxCameraZPositionX = this.BackgroundSizeX / (2 * Math.tan((this.AngleOfCamera * this.cameraRatio / 2) * Math.PI / 180))
    this.MaxCameraZPosition = maxCameraZPositionX < maxCameraZPositionY ? maxCameraZPositionX : maxCameraZPositionY

    this.stepOfCamera = this.MaxCameraZPosition / this.countPositions
  }

  constructor (canvas, countPositions) {
    let scene, renderer
    this.countPositions = countPositions

    this.calcCameraProps()

    this.camera = new Physic(
      new THREE.PerspectiveCamera(this.AngleOfCamera, this.cameraRatio, 1, 10000),
      {z: this.stepOfCamera}
    )
    this.physicObjects.push(this.camera)

    scene = new THREE.Scene()
    scene.add(this.camera.mesh)

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(200, 200, 200),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('green'),
        wireframe: false
      })
    )

    scene.add(this.cube)

    let geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(-100, 250, 0))
    geometry.vertices.push(new THREE.Vector3(0, 350, 0))
    geometry.vertices.push(new THREE.Vector3(100, 250, 0))

    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: new THREE.Color('blue')}))
    scene.add(line)

    // TODO: add on load adding, add preload
    let backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.BackgroundSizeX, this.BackgroundSizeY, 0),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require('../../images/header4.jpg'))
      })
    )
    scene.add(backgroundMesh)

    // // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight)
    //
    // // add directional light source
    let directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(200, 200, 0).normalize()
    scene.add(directionalLight)

    // --------------
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setSize(window.innerWidth, window.innerHeight)

    this.scene = scene
    this.renderer = renderer
    this.clock = new THREE.Clock(false)

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  setPosition (pos) {
    if (pos > this.countPositions - 1) {
      pos = this.countPositions - 1
    }
    this.positionOfCamera = this.stepOfCamera * (pos + 1)
    this.camera.setPositionZ(this.positionOfCamera)
  }

  start () {
    this.clock.start()
    this.animate()
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.02
    this.render()
  }

  render () {
    let delta = this.clock.getDelta()
    for (let o of this.physicObjects) { o.tick(delta) }
    this.renderer.render(this.scene, this.camera.mesh)
  }

  onWindowResize () {
    this.calcCameraProps()
    this.camera.mesh.aspect = this.cameraRatio

    this.camera.mesh.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
