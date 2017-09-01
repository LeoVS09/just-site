import './style/index.styl'
// import './components/navigation'
// import './slides/home'
import view from './components/view'
import './components/description'
// import './slides/about'
import display from './scripts'

const slidesCount = 5
let currentSlide = 0

display({
  canvas: document.querySelector('canvas'),
  view: view(),
  slidesCount,
  currentSlide
})
