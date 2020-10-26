<template>
  <picture>
    <source :srcset="srcs('webp')" type="image/webp" :sizes="`${w}px`" />
    <source :srcset="srcs()" type="image/jpeg" :sizes="`${w}px`" />
    <img
      :src="placeholderSrc"
      :alt="`${alt ? alt : 'Simon Daufresne'}`"
      :width="data.width"
      :height="data.height"
      decoding="async"
      loading="lazy"
    />
  </picture>
</template>
<script>
import { mapState } from 'vuex'
import emitter from '~/assets/js/events/EventsEmitter'
export default {
  name: 'vMedia',
  data() {
    return { w: 100 }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    alt: {
      type: String,
      default: ''
    }
  },
  computed: {
    url() {
      return this.data.url.replace('.jpg', '').replace('.png', '')
    },
    color() {
      return this.isDark ? '%23f6eee3' : '%231a1a1a'
    },
    placeholderSrc() {
      return `data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20${this.data.width}%20${this.data.height}%22%3E%3Crect%20width=%22${this.data.width}%22%20height=%22${this.data.height}%22%20style=%22fill:${this.color}%22%3E%3C/rect%3E%3C/svg%3E`
    }
  },
  methods: {
    load() {},
    srcs(type) {
      const format = type
        ? type
        : this.data.url.slice(this.data.url.length - 3, this.data.url.length)
      let str = `${this.url}@mx.${format} 300w, ${this.url}@.5x.${format} 760w, ${this.url}@1x.${format} 1000w, ${this.url}.${format} 1280w`
      return str
    },
    resize() {
      this.w = window.innerWidth
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._resize)
  },
  mounted() {
    this._resize = this.resize.bind(this)
    window.addEventListener('resize', this._resize)
    this.resize()
  }
}
</script>
