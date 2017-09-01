import graphic from './graphics'
import wheel from './wheel'

export default function ({ canvas, slidesCount, currentSlide, view }) {
  let duration = 1

  let gr = graphic(canvas, slidesCount, duration)

  wheel()
    .up(() => prevSlide())
    .down(() => nextSlide())

  function nextSlide () {
    if (currentSlide < slidesCount - 1) {
      currentSlide++
    }
    console.log(currentSlide)
    gr.setPosition(currentSlide)
    view.setVisible(currentSlide)
  }

  function prevSlide () {
    if (currentSlide > 0) {
      currentSlide--
    }
    console.log(currentSlide)
    gr.setPosition(currentSlide)
    view.setVisible(currentSlide)
  }
}
