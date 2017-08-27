import Detector from './Detector'
import { GraphicEngine } from './canvas'

export default (canvas, countPositions) => {
  let engine
  if (Detector.webgl) {
    engine = new GraphicEngine(canvas, countPositions)
    engine.start()
  } else {
    // TODO: add more logic and other warning message
    let warning = Detector.getWebGLErrorMessage()
    document.querySelector('body').appendChild(warning)
    return null
  }
  return {
    setPosition (number) {
      engine.setPosition(number)
    }
  }
}
