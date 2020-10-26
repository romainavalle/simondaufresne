<template>
  <div class="clients">
    <v-title tag="h2" ref="title" text="Clients" />
    <ul class="c c--1000" ref="list">
      <v-client
        v-for="(client, i) in clients"
        :key="`client-${i}`"
        :client="client"
        ref="clients"
      />
    </ul>
  </div>
</template>
<script>
import vTitle from '~/components/common/title.vue'
import vClient from '~/components/about/clients/client.vue'
export default {
  name: 'clients',
  data() {
    return { isListShown: false }
  },
  props: ['clients'],
  components: { vClient, vTitle },

  methods: {
    tick(scrollTop) {
      this.$refs.title.tick(scrollTop)
      if (scrollTop > this.top - this.h * 0.7) {
        if (!this.isListShown) {
          this.isListShown = true
          this.$refs.clients.forEach((el, i) => {
            el.show(Math.random())
          })
        }
      }
      if (scrollTop < this.top - this.h) {
        if (this.isListShown) {
          this.isListShown = false
          this.$refs.clients.forEach((el, i) => {
            el.reset()
          })
        }
      }
    },
    resize(w, h) {
      this.h = h
      this.$refs.title.resize(w, h)
      this.top = this.$refs.list.getBoundingClientRect().top
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.clients {
  margin-top: $space100;
  ul {
    padding-top: $space60;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  @include below(medium) {
    margin-top: $space60M;
    ul {
      padding-top: $space60M;
    }
  }
}
</style>
