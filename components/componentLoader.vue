<template>
  <component
    :is="getComponent"
    :data="data"
    ref="comp"
    class="work-content"
  ></component>
</template>

<script>
import vSingleLarge from '~/components/work/single-large.vue'
import vSingleMedium from '~/components/work/single-medium.vue'
import vDuo from '~/components/work/duo.vue'
import vTrio from '~/components/work/trio.vue'
import vImgText from '~/components/work/img-text.vue'
export default {
  name: 'component-loader',
  props: ['data'],
  data() {
    return {
      links: {
        SingleLargeRecord: vSingleLarge,
        SingleMediumRecord: vSingleMedium,
        ImgTextRecord: vImgText,
        DuoRecord: vDuo,
        TrioRecord: vTrio
      }
    }
  },
  computed: {
    getComponent() {
      let link = this.links[this.data.__typename]
      if (!link) {
        console.warn(`Can't find  ${this.data.__typename}`)
        return false
      }
      const comp = link
      return comp
    }
  },
  methods: {
    tick(scrollTop) {
      this.$refs.comp.tick && this.$refs.comp.tick(scrollTop)
    },
    resize(w, h) {
      this.$refs.comp.resize && this.$refs.comp.resize(w, h)
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.work-content {
  margin-bottom: $space100;
  @include below(medium) {
    margin-bottom: $space100M;
  }
}
</style>
