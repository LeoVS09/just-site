
export function EventEmitter (events = []) {
  events.forEach(name => {
    let actions = []
    this[`__${name}Actions`] = actions
    this[name] = action => {
      actions.push(action)
      return this
    }
  })
  this.emit = event => {
    this[`__${event}Actions`] &&
    this[`__${event}Actions`].forEach(action => action())
  }
}
