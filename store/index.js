import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import commonQuery from '~/assets/graphql/common.js'
export const state = () => ({
  path: process.env.NODE_ENV === 'production' ? '/' : '/',
  isNavOpen: false,
  common: {},
  isFirstLoad: true,
  isDark: 0,
  reducedMotion: false,
  allWorks: []
})
export const mutations = {
  SET(state, obj) {
    state[obj.property] = obj.value
  },
  SWAP_COLOR(state) {
    state.isDark = !state.isDark
  }
}
export const actions = {
  nuxtServerInit({ context, commit }) {
    return getAsyncData(context, commonQuery, 'common').then((data) => {
      //commit('SET', { property: 'common', value: data.common })
      commit('SET', { property: 'allWorks', value: data.worksPage.works })
    })
  },
  setNavOpen({ commit }, bool) {
    commit('SET_NAV_OPEN', bool)
  },
  toggleNavOpen({ commit }) {
    commit('TOGGLE_NAV_OPEN')
  },
  set({ commit }, obj) {
    commit('SET', obj)
  },
  swapColor({ commit }) {
    commit('SWAP_COLOR')
  }
}
export const getters = {
  currentWork(state) {
    const slug = state.allWorks.find(
      (el) => el.slug === state.route.params.slug
    )
    return slug
  },
  currentIndex(state, getters) {
    return state.allWorks.indexOf(getters.currentWork)
  },
  nextWork: (state) => (slug) => {
    const index = state.allWorks.indexOf(
      state.allWorks.find((el) => el.slug === slug)
    )

    return index === state.allWorks.length - 1
      ? state.allWorks[0].slug
      : state.allWorks[index + 1].slug
  },
  isTouch() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  }
}
