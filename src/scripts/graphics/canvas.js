import '../../style/canvas.styl'
import { Physic } from './physic'
import { CameraControls } from './controls'
import * as THREE from 'three'

const defaultAnimationDuration = 1 // in seconds

export class GraphicEngine {
  positionOfCamera = 1000
  // TODO: work with angle and max z formula
  AngleOfCamera = 35
  BackgroundSizeX = 1920
  BackgroundSizeY = 1200
  physicObjects = []

  calcCameraProps () {
    this.cameraRatio = window.innerWidth / window.innerHeight

    // calculating max z offset of camera
    let tan = angle => Math.tan(angle * Math.PI / 180)
    let maxCameraZPositionY = this.BackgroundSizeY / (2 * tan(this.AngleOfCamera / 2))
    let maxCameraZPositionX = this.BackgroundSizeX / (2 * tan(this.AngleOfCamera * this.cameraRatio / 2))

    this.MaxCameraZPosition = maxCameraZPositionX < maxCameraZPositionY ? maxCameraZPositionX : maxCameraZPositionY

    this.stepOfCamera = this.MaxCameraZPosition / this.countPositions
  }

  constructor (canvas, countPositions, duration = defaultAnimationDuration) {
    let scene, renderer
    this.countPositions = countPositions

    this.calcCameraProps()

    this.camera = new Physic(
      new THREE.PerspectiveCamera(this.AngleOfCamera, this.cameraRatio, 1, 10000),
      { z: this.stepOfCamera, duration }
    )
    this.physicObjects.push(this.camera)

    this.controls = new CameraControls(this.camera.mesh, canvas)

    scene = new THREE.Scene()
    scene.add(this.camera.mesh)

    // TODO: refactor, logic must be out of graphic engine
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(200, 200, 200),
      new THREE.MeshLambertMaterial({
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

    // add objects
    let cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 400, 0),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require('../../images/cloud-c.png')),
        transparent: true,
        opacity: 0.8
        // lights: true
        // combine: THREE.MixOperation
      })
    )
    cloud.position.z = 200
    cloud.position.y = -200
    cloud.position.x = 400
    scene.add(cloud)

    let cloud2 = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 400, 0),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require('../../images/cloud2-c.png')),
        transparent: true,
        opacity: 0.8
        // lights: true
        // combine: THREE.MixOperation
      })
    )
    cloud2.position.z = 300
    cloud2.position.y = 200
    cloud2.position.x = -200
    scene.add(cloud2)

    let cloud3 = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 400, 0),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require('../../images/cloud3-c.png')),
        transparent: true,
        opacity: 0.8
        // lights: true
        // combine: THREE.MixOperation
      })
    )
    cloud3.position.z = 100
    cloud3.position.y = 300
    cloud3.position.x = 500
    scene.add(cloud3)

    let cloud4 = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 400, 0),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require('../../images/cloud4-c.png')),
        transparent: true,
        opacity: 0.8
        // lights: true
        // combine: THREE.MixOperation
      })
    )
    cloud4.position.z = 200
    cloud4.position.y = -100
    cloud4.position.x = -300
    scene.add(cloud4)

    // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight)
    //
    // // add directional light source
    let directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(500, 500, 300).normalize()
    scene.add(directionalLight)

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

    let nextPosition = this.stepOfCamera * (pos + 1)
    // eslint-disable-next-line
    if (nextPosition != this.positionOfCamera) {
      this.positionOfCamera = nextPosition
      this.camera.setPositionZ(this.positionOfCamera)
    }
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

    for (let o of this.physicObjects) { o.update(delta) }
    this.controls.update(delta)

    this.renderer.render(this.scene, this.camera.mesh)
  }

  onWindowResize () {
    this.calcCameraProps()
    this.camera.mesh.aspect = this.cameraRatio

    this.camera.mesh.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
