import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/layout',
    hidden: true
  },
  {
    path: '/layout',
    component: () => import('@/layout/index'),
    hidden: true,
    children: [
      {
        path: '/layout/sys/item',
        component: () => import('@/views/sys/index'),
        hidden: true
      },
      {
        path: '/layout/asset/house',
        component: () => import('@/views/house/index'),
        hidden: true
      },
      {
        path: '/layout/asset/land',
        component: () => import('@/views/land/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const asyncRoutes = []

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

export default router
