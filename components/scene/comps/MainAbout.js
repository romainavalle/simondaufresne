import { Renderer, Camera, Transform, Texture } from 'ogl/src/index.mjs'

import Plane from './Plane.js'
import ResizeHelper from '~/assets/js/utils/ResizeHelper.js'
import emitter from '~/assets/js/events/EventsEmitter.js'
import MouseHelper from '~/assets/js/utils/MouseHelper.js'
import clamp from '~/assets/js/math/clamp.js'

export default class Main {
  constructor(el, allWorks, reducedMotion = false) {
    this.reducedMotion = reducedMotion
    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 100
    this.cameraX = 0
    this.cameraY = 0
    this.rotateX = 0
    this.rotateY = 0
    this.mousePosCoef = 0.2
    this.mouseAngleDivider = 100
    this.routeName = 'index'
    this.isTransitioning = false
    this.isShownBottom = false
    this.planes = []
    this.textureArray = []
    this.allWorks = allWorks
    this.init(el)
  }

  init(el) {
    this.renderer = new Renderer({ dpr: 1.5, alpha: true })
    this.gl = this.renderer.gl
    el.appendChild(this.gl.canvas)
    this.scene = new Transform()
    this.camera = new Camera(this.gl)
    this.camera.far = 200
    this.camera.position.z = this.cameraZ
    this.loadProjects()
  }
  loadProjects() {
    this.projectLoaded = 0
    this.loadProject(this.allWorks[this.projectLoaded])
  }
  canUseWebP() {
    var elem = document.createElement('canvas')

    if (!!(elem.getContext && elem.getContext('2d'))) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    }

    // very old browser like IE 8, canvas not supported
    return false
  }
  loadProject(work) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const imageTex = new Texture(this.gl, { minFilter: this.gl.NEAREST })

    imageTex.slug = 'about'
    img.onload = () => {
      imageTex.image = img
      this.textureArray.push(imageTex)
      if (this.projectLoaded < this.allWorks.length - 1) {
        this.loadProject(this.allWorks[++this.projectLoaded])
      } else {
        this.onLoaded()
      }
    }

    let size = ''
    if (Math.min(ResizeHelper.width(), ResizeHelper.height()) < 600) {
      size = '@1x'
    } else if (Math.min(ResizeHelper.width(), ResizeHelper.height()) < 300) {
      size = '@.5x'
    } else if (Math.min(ResizeHelper.width(), ResizeHelper.height()) < 150) {
      size = '@mx'
    }

    let ext
    if (work.indexOf('png') !== -1) {
      ext = this.canUseWebP() ? '.webp' : '.png'
    } else {
      ext = this.canUseWebP() ? '.webp' : '.jpg'
    }
    let imgUrl = work.replace('.jpg', size + ext).replace('.png', size + ext)
    img.src = imgUrl
  }
  onLoaded() {
    this.textureArray.forEach((tex, i) => {
      const plane = new Plane(this.gl, this.scene, tex, i, this.reducedMotion)
      this.planes.push(plane)
    })
    this.planes.forEach((plane, i) => {
      plane.setRouteName('index')
    })
    this.resize()
    this.planes[0].show()
  }
  hideCard() {
    this.planes[0].hide()
  }

  tick(scrollTop) {
    const vFOV = (60 * Math.PI) / 180
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(this.cameraZ)
    const width = (height * this.w) / this.h
    this.cameraX =
      -((MouseHelper.easeX - this.w / 2) / this.w) * width * this.mousePosCoef //magic number
    this.cameraY =
      ((MouseHelper.easeY - this.h / 2) / this.h) * height * this.mousePosCoef
    this.rotateX =
      (clamp((MouseHelper.easeY - MouseHelper.easeSlowY) * 0.1, -15, 15) *
        Math.PI) /
      this.mouseAngleDivider
    this.rotateY =
      (-clamp((MouseHelper.easeX - MouseHelper.easeSlowX) * 0.1, -15, 15) *
        Math.PI) /
      this.mouseAngleDivider

    this.camera.position.x = this.cameraX
    this.camera.position.y = this.cameraY

    if (!this.reducedMotion) this.time += 0.016

    this.planes.forEach((plane, i) => {
      plane.render(scrollTop, this.rotateX, this.rotateY, this.time)
    })
    this.camera.position.z = this.cameraZ
    this.renderer.render({ scene: this.scene, camera: this.camera })
  }

  resize(w, h) {
    if (w && h) {
      this.w = w
      this.h = h
    }
    if (this.w < 1000) {
      this.mousePosCoef = 0
      this.cameraZ = 70
    }
    this.planes.forEach((plane) => {
      plane.resize(this.w, this.h)
    })
    this.camera.perspective({ aspect: this.w / this.h })
    this.renderer.setSize(this.w, this.h)
  }
}
