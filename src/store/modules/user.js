import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getModules } from '@/api/module'

const state = {
  token: getToken(),
  name: '',
  roles: [],
  modules: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MODULES: (state, modules) => {
    state.modules = modules
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const {
      phoneNumber,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        phoneNumber: phoneNumber.trim(),
        password: password
      }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }

        const {
          roles,
          name,
          avatar,
          introduction
        } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject(new Error('getInfo: roles must be a non-null array!'))
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getModules ({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getModules(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }
        // 处理数据
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles ({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
