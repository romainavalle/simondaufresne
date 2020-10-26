<template>
  <div
    class="progress"
    :class="{
      error: $route.name === '404' || $route.name === 'custom404'
    }"
  ></div>
</template>

<script>
import transform from 'dom-transform'
export default {
  methods: {
    resize(w, h, ph) {
      this.h = h
      this.ph = ph
    },
    tick(scrollTop) {
      transform(this.$el, { scale3d: [1, scrollTop / (this.ph - this.h), 1] })
    }
  }
}
</script>

<style lang="scss">
.progress {
  position: fixed;
  top: 0;
  height: 100vh;
  left: 0;
  width: 4px;
  transform-origin: 50% 0%;
  z-index: 10;
  &.error {
    display: none;
  }
}
</style>
