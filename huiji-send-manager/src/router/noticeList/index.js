const noticeRouterList = [
  {
    path: '/manager/notice/list',
    name: 'noticeList',
    component: resolve => require(['../../views/noticeList'], resolve),
    meta: {
      name: '通知列表',
      requireAuth: true
    }
  },
  {
    path: '/manager/notice/add',
    name: 'addMessage',
    component: resolve => require(['../../views/addMessage.vue'], resolve),
    meta: {
      name: '新增通知',
      requireAuth: true
    }
  }
]

export default noticeRouterList
