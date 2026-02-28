export const state = {
  me: {},
}

export const mutations = {
  setMe(state, me) {
    state.me = me
  },
  setPrice(state, price) {
    state.me.price = price
  },
}

export const actions = {
  setMe({ commit }, me) {
    commit('setMe', me)
  },
  setPrice({ commit }, price) {
    commit('setPrice', price)
  },
}

export default {
  state,
  mutations,
  actions,
  namespaced: true,
}
