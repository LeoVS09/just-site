import graphic from './graphics'
import wheel from './wheel'

const slidesCount = 5
let currentSlide = 0
let canvas = document.querySelector('canvas')

let gr = graphic(canvas, slidesCount)

wheel(canvas)
  .up(() => prevSlide())
  .down(() => nextSlide())

function nextSlide () {
  if (currentSlide < slidesCount - 1) {
    currentSlide++
  }
  console.log(currentSlide)
  gr.setPosition(currentSlide)
}

function prevSlide () {
  if (currentSlide > 0) {
    currentSlide--
  }
  console.log(currentSlide)
  gr.setPosition(currentSlide)
}

