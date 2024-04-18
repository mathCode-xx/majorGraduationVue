import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        meta: { titles: ['首页'] },
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404')
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401')
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const mainRoutes = [
  {
    path: '/sys/item',
    component: () => import('@/views/sys/item/index.vue')
  },
  {
    path: '/sys/permission',
    component: () => import('@/views/sys/permission/index.vue')
  },
  {
    path: '/asset/house',
    component: () => import('@/views/house/index.vue')
  },
  {
    path: '/asset/land',
    component: () => import('@/views/land/index.vue')
  },
  {
    path: '/sys/role',
    component: () => import('@/views/sys/role/index.vue')
  },
  {
    path: '/sys/user',
    component: () => import('@/views/sys/user/index.vue')
  },
  {
    path: '/person',
    component: () => import('@/views/person/index.vue')
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (to.path === 'login' && hasToken) {
    next('/')
    return
  }
  // if (to.path !== '/login' && !hasToken) {
  //   next('/login')
  //   return
  // }
  next()
})

export default router
