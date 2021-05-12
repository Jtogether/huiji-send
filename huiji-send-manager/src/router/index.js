import Vue from 'vue'
import VueRouter from 'vue-router'
import meetingRouterList from './meetingList' // 会议管理路由
import noticeRouterList from './noticeList' // 通知管理路由
import { Message } from 'element-ui'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  ...meetingRouterList,
  ...noticeRouterList,
  {
    path: '/',
    name: 'home',
    redirect: { name: 'Login' }
  },
  {
    path: '/Login',
    name: 'Login',
    component: resolve => require(['../views/login'], resolve),
    meta: {
      name: '后台登录'
    }
  },
  {
    path: '/manager/person/list',
    name: 'personList',
    component: resolve => require(['../views/personList'], resolve),
    meta: {
      name: '人员管理',
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  routes
})

// 全局路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem('resToken')) {
      next()
    } else {
      Message.error('请先进行登录！')
      setTimeout(() => {
        next({
          path: '/Login'
        })
      }, 3000)
    }
  } else {
    next()
  }
})

export default router
