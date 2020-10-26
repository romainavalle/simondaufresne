//needs 2 img text for transition so only one plane in the stage!
import { Plane, Vec2, Mesh, Program } from 'ogl/src/index.mjs'
import planeVs from '../shaders/planeCover.vs.js'
import planeFs from '../shaders/planeCover.fs.js'
export default class PlaneGeo {
  constructor(gl, scene, texture, id, reducedMotion = false) {
    this.id = id
    this.gl = gl
    this.texture = texture
    this.reducedMotion = reducedMotion
    this.reset()
    this.init(scene)
  }
  init(scene) {
    const program = new Program(this.gl, {
      vertex: planeVs,
      fragment: planeFs,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMap: { value: this.texture },
        uResolution: { value: new Vec2() },
        uAlpha: { value: 0 },
        uTransition: { value: this.transition }
      }
    })
    this.time = 0
    const geometry = new Plane(this.gl, {
      width: window.innerWidth < 1000 ? 25 : 35,
      height: window.innerWidth < 1000 ? 32 : 45,
      widthSegments: window.innerWidth < 1000 ? 10 : 30,
      heightSegments: window.innerWidth < 1000 ? 15 : 40
    })

    this.mesh = new Mesh(this.gl, { geometry, program })
    this.mesh.setParent(scene)
  }
  show(obj) {
    gsap.killTweensOf(this)
    gsap.to(this, {
      transition: 0,
      duration: this.reducedMotion ? 0 : 3,
      ease: 'Elastic.out'
    })

    gsap.to(this, { alpha: 1, duration: this.reducedMotion ? 0 : 0.3 })
    gsap.to(this, {
      positionZ: 0,
      positionX: this.w < 1000 ? 0 : -4,
      positionY: 0,
      transitionRotZ: 0,
      transitionRotX: 0,
      transitionRotY: 0,
      duration: this.reducedMotion ? 0 : 2,
      ease: 'power4.out'
    })
  }
  hide() {
    gsap.killTweensOf(this)
    gsap.to(this, {
      positionZ: -10,
      positionX: -75,
      positionY: 100,
      transitionRotZ: -1,
      transitionRotX: -1,
      transitionRotY: -1,
      transition: 1,
      duration: this.reducedMotion ? 0 : 1.5,
      ease: 'power4.in '
    })
    gsap
      .to(this, {
        alpha: 0,
        delay: 0.3,
        duration: this.reducedMotion ? 0 : 1.2,
        ease: 'power4.out '
      })
      .then(() => {
        this.reset()
      })
  }
  resize(w, h) {
    this.w = w
    this.h = h
    if (this.mesh) {
      this.mesh.program.uniforms.uResolution.value = new Vec2(w, h)
    }
  }
  changePage() {
    this.positionZ = 0
    this.transitionRotZ = 0
    this.transitionRotX = 0
    this.transitionRotY = 0
    this.transition = 0
    gsap.killTweensOf(this)
    gsap.to(this, {
      transition: 0.5,
      positionZ: 20,
      transitionRotX: -0.4,
      transitionRotY: 0.4,
      duration: this.reducedMotion ? 0 : 0.75,
      delay: 0.25,
      repeat: 1,
      yoyo: true,
      ease: 'Power3.out'
    })
    gsap.to(this, {
      rotZ: -Math.PI / 20,
      duration: this.reducedMotion ? 0 : 2,
      alpha: 1,
      delay: 0.25,
      ease: 'power4.out '
    })
    gsap.to(this, {
      positionY: 0,
      positionX: 0,
      duration: this.reducedMotion ? 0 : 2,
      ease: 'power3.inOut '
    })
  }

  setRouteName(name) {
    this.routeName = name
  }
  reset() {
    this.alpha = 0
    this.positionZ = 40
    this.positionX = 16
    this.positionY = -60
    this.transitionRotZ = 1
    this.transitionRotX = 1
    this.transitionRotY = 1
    this.rotZ = Math.PI / 20
    this.transition = 1
  }

  render(scrollTop, rotX, rotY, time) {
    this.mesh.position.z = this.positionZ
    this.mesh.position.x = this.positionX
    this.mesh.position.y = this.positionY + scrollTop
    this.mesh.rotation.y =
      rotY +
      (Math.PI / 5) * this.transitionRotY +
      (this.routeName !== 'work' ? scrollTop / 100 : 0)
    this.mesh.rotation.x = rotX + (-Math.PI / 6) * this.transitionRotX
    this.mesh.rotation.z = this.rotZ + (-Math.PI / 6) * this.transitionRotZ
    this.mesh.program.uniforms.uAlpha.value = this.alpha
    this.mesh.program.uniforms.uTime.value = time
    this.mesh.program.uniforms.uTransition.value = this.transition
  }
}
