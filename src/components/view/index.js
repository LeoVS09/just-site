import './index.styl'
import wheel from '../../scripts/wheel'
import approach from '../../scripts/approach'

let view = approach(document.querySelector('.view-container'),
  {
    perspective: 1000,
    start: 500,
    end: 1000,
    step: 100
  })

wheel()
  .up(() => {
    view.comeUp()
  })
  .down(() => {
    view.moveAway()
  })
