import { login } from '@/api/user'
import { getToken, setToken, removeToken, setFlushToken } from '@/utils/auth.js'
import router, { resetRouter, mainRoutes } from '@/router'
import { getUserModules } from '@/api/module'

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
        resetRouter() // 重置路由
        const { data } = response
        const token = data.token
        const flushToken = data.flushToken
        commit('SET_TOKEN', token)
        setToken(token)
        setFlushToken(flushToken)
        resolve()
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
      getUserModules().then(response => {
        commit('SET_MODULES', [])
        const { data } = response
        // 处理数据
        const moduleMap = {}
        const componentMap = {}
        data.forEach(module => {
          moduleMap[module.moduleId] = module
          componentMap[module.url] = module
        })

        const rootModules = []

        data.forEach(module => {
          const { upperModuleId } = module
          if (upperModuleId === 0) {
            // 顶级模块，直接加入根节点列表
            rootModules.push(module)
          } else {
            // 子模块，找到对应的父模块并添加到父模块的 children 数组中
            const parentModule = moduleMap[upperModuleId]
            if (parentModule) {
              if (!parentModule.children) {
                parentModule.children = []
              }
              parentModule.children.push(module)
            }
          }
        })
        mainRoutes.forEach(_router => {
          let module = componentMap[_router.path]
          if (!module) {
            return
          }
          let meta = [module.name]
          while (module.upperModuleId !== 0) {
            module = moduleMap[module.upperModuleId]
            meta = [...[module.name], ...meta]
          }
          if (componentMap[_router.path]) {
            _router.meta = {
              titles: meta
            }
            console.log(_router)
            router.addRoute('Layout', _router)
          }
        })

        // console.log(rootModules)
        commit('SET_MODULES', rootModules)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
