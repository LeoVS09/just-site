import './index.styl'

const visibleClass = 'visible'
const noneClass = 'none'

class View {
  constructor (duration = 1000) {
    this.element = document.querySelector('.view-container')
    this.slides = [...this.element.querySelector('.view-slides').children]
    this.slidesCount = this.slides.length
    this.duration = duration
    this.setVisible(0)
  }

  setVisible (num) {
    if (this.slidesCount <= num) {
      num = this.slidesCount - 1
    } else if (num < 0) {
      num = 0
    }

    this.slides.forEach(el => el.classList.remove(visibleClass))
    this.slides[num].classList.add(visibleClass)
    this.slides[num].classList.remove(noneClass)
    setTimeout(function () {
      this.slides.forEach((el, i) => {
        if (i !== num) { el.classList.add(noneClass) }
      })
    }, this.duration)
    this.curent = num
  }

  next () {
    this.setVisible(this.curent + 1)
  }

  prev () {
    this.setVisible(this.curent - 1)
  }
}

export default function () {
  return new View()
}
