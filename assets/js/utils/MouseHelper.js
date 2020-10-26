class MouseHelper {
  constructor() {
    this.isFirst = true
    this.isMouseNeeded = false

    this._mouseMoveHandler = this.mouseMoveHandler.bind(this)
    if (process.browser) {
      const isTouch = () => {
        try {
          document.createEvent('TouchEvent')
          return true
        } catch (e) {
          return false
        }
      }
      if (!isTouch()) {
        window.addEventListener('mousemove', this._mouseMoveHandler, {
          passive: true
        })
      }
      this.x = window.innerWidth * 0.5
      this.y = window.innerHeight * 0.5
      this.easeX = this.x
      this.easeY = this.y
      this.easeMouseX = this.x
      this.easeMouseY = this.y
      this.easeSlowX = this.x
      this.easeSlowY = this.y
    }
  }

  mouseMoveHandler(e) {
    this.x = e.clientX
    this.y = e.clientY

    this.isFirst = false
  }
  setMouse() {
    this.easeMouseX = this.easeSlowX = this.easeX = this.x
    this.easeMouseY = this.easeSlowY = this.easeY = this.y
  }
  tick() {
    const dX = this.x - this.easeX
    const dY = this.y - this.easeY
    const dMouseX = this.x - this.easeMouseX
    const dMouseY = this.y - this.easeMouseY
    const dSlowX = this.x - this.easeSlowX
    const dSlowY = this.y - this.easeSlowY
    this.easeX += dX / 10
    this.easeY += dY / 10
    this.easeMouseX += dMouseX / 6
    this.easeMouseY += dMouseY / 6
    this.easeSlowX += dSlowX / 20
    this.easeSlowY += dSlowY / 20
  }
}

export default new MouseHelper()
