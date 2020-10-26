import memoize from 'lodash/memoize'
import Emitter from '~/assets/js/events/EventsEmitter'

class ResizeHelper {
  constructor() {
    if (!process.browser) return
    this.dimension = memoize(this._dimension)
    const isTouch = () => {
      try {
        document.createEvent('TouchEvent')
        return true
      } catch (e) {
        return false
      }
    }

    window.addEventListener(
      //isTouch() ? 'orientationChange' : 'resize',
      'resize',
      () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.onResize.bind(this), 100)
      },
      { passive: true }
    )
  }

  onResize(e) {
    this.dimension = memoize(this._dimension)
    Emitter.emit('GLOBAL:RESIZE')
  }
  resetDimension() {
    this.dimension = memoize(this._dimension)
  }

  clear() {
    this.dimension.cache = {}
  }

  _dimension() {
    var body = document.body,
      html = document.documentElement
    var docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    )
    var dimension = {
      width: window.innerWidth,
      innerWidth: document.body.clientWidth,
      height: window.innerHeight,
      docHeight: docHeight
    }

    dimension.ratio = dimension.width / dimension.height
    return dimension
  }

  innerWidth() {
    return this.dimension().innerWidth
  }

  width() {
    return this.dimension().width
  }

  height() {
    return this.dimension().height
  }

  ratio() {
    return this.dimension().ratio
  }

  docHeight() {
    return this.dimension().docHeight
  }
}

export default new ResizeHelper()
