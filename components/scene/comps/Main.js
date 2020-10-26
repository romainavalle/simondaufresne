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
    this.mousePosCoef = 0.2
    this.mouseAngleDivider = 100
    this.cameraX = 0
    this.cameraY = 0
    this.rotateX = 0
    this.rotateY = 0
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
    emitter.on('go-next', this.goNext.bind(this))
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
  canUseAvif() {
    var elem = document.createElement('canvas')

    if (!!(elem.getContext && elem.getContext('2d'))) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/avif').indexOf('data:image/avif') == 0
    }

    // very old browser like IE 8, canvas not supported
    return false
  }
  loadProject(work) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const imageTex = new Texture(this.gl, { minFilter: this.gl.NEAREST })

    imageTex.slug = work.slug
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
    const ext = this.canUseAvif()
      ? '.avif'
      : this.canUseWebP()
      ? '.webp'
      : '.jpg'
    let imgUrl = work.hero.url.replace('.jpg', size + ext)

    img.src = imgUrl
  }
  onLoaded() {
    this.textureArray.forEach((tex, i) => {
      const plane = new Plane(this.gl, this.scene, tex, i, this.reducedMotion)
      this.planes.push(plane)
    })

    this.textureArray.forEach((tex, i) => {
      const plane = new Plane(this.gl, this.scene, tex, i, this.reducedMotion)
      this.planes.push(plane)
    })
    this.planes.forEach((plane, i) => {
      plane.setRouteName(this.routeName)
    })
    if (this.id !== -1) this.planes[this.id].show()
    this.resize()
  }
  doRouteTransition(id) {
    this.isTransitioning = true
    this.id = id
    if (!this.planes.length) return
    gsap.to(this, {
      cameraZ: 100,
      mousePosCoef: 0.2,
      mouseAngleDivider: 100,
      cameraX: 0,
      cameraY: 0,
      rotateX: 0,
      rotateY: 0,
      duration: this.reducedMotion ? 0 : 2,
      ease: 'power3.inOut'
    })
    this.planes.forEach((plane, i) => {
      if (i === this.id) {
        plane.changePage()
      }
    })
  }

  changeRoute(id) {
    this.id = id
    this.currentPage = id
    this.isShownBottom = false
    if (!this.planes.length) return
    this.planes.forEach((plane, i) => {
      if (i !== this.id) {
        plane.reset()
      }
    })
  }

  goNext() {
    if (this.id !== -1) {
      this.planes[this.id].hide()
    }
    this.id++
    if (this.id === 3) this.id = 0
    this.planes[this.id].show()
  }

  showBottom() {
    if (this.isShownBottom) return
    this.isShownBottom = true
    this.id = this.currentPage + 1

    if (this.id == this.allWorks.length) this.id = 0
    this.planes[this.id].show()
  }
  onWorkEnter(obj) {
    this.id = obj.id
    this.currentPage = obj.id
    if (this.planes[obj.id].alpha !== 0) {
      const p = this.planes[obj.id + this.planes.length / 2]
      this.planes[obj.id + this.planes.length / 2] = this.planes[obj.id]
      this.planes[obj.id] = p
    }
    this.planes[obj.id].show(obj)
  }

  onWorkLeave(obj) {
    this.id = -1
    this.planes[obj.id].hide()
  }

  setRouteName(name) {
    if (!this.isTransitioning) {
      this.cameraX = 0
      this.cameraY = 0
      this.mousePosCoef = 0.2
      this.mouseAngleDivider = 100
      this.rotateX = 0
      this.rotateY = 0
      this.cameraZ = 100
    }
    this.routeName = name
    this.isTransitioning = false
    if (this.routeName === 'work') {
      this.cameraZ = 150
      this.mousePosCoef = 0.8
      this.mouseAngleDivider = 50
    }
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
    if (this.routeName == 'work' && !this.isTransitioning) {
    }
    this.camera.position.x = this.cameraX
    this.camera.position.y = this.cameraY

    if (!this.reducedMotion) this.time += 0.016

    this.planes.forEach((plane, i) => {
      const scroll =
        this.routeName === 'index'
          ? (scrollTop - this.pageHeight) / 8
          : this.routeName === 'work'
          ? 0
          : this.currentPage === i
          ? scrollTop / 10
          : (scrollTop - this.pageHeight) / 8
      plane.render(scroll, this.rotateX, this.rotateY, this.time)
    })
    this.camera.position.z = this.cameraZ
    this.renderer.render({ scene: this.scene, camera: this.camera })
  }

  resize(w, h, pageHeight) {
    if (w && h) {
      this.w = w
      this.h = h
      this.pageHeight = pageHeight - h
    }
    this.planes.forEach((plane) => {
      plane.resize(this.w, this.h)
    })
    this.camera.perspective({ aspect: this.w / this.h })
    this.renderer.setSize(this.w, this.h)
  }
}
