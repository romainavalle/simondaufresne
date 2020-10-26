import normalizeWheel from 'normalize-wheel'
import { clamp } from '~/assets/js/math'
class WheelHelper {
  constructor() {
    this.delta = 0
    this.deltaEase = 0
    this._onWheel = this.onWheel.bind(this)
    if (process.browser)
      window.addEventListener('wheel', this._onWheel, {
        passive: true
      })
  }

  onWheel(e) {
    const normalized = normalizeWheel(e)
    this.delta = clamp(normalized.pixelY, -60, 60)
  }
  tick() {
    let delta = Math.abs(this.delta)
    delta--
    if (delta < 0) delta = 0
    this.delta = Math.sign(this.delta) * delta
    const dX = this.delta - this.deltaEase
    this.deltaEase += dX / 10
  }
}

export default new WheelHelper()
