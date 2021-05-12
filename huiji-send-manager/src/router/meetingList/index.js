const meetingRouterList = [
  {
    path: '/manager/meeting/list',
    name: 'meetingList',
    component: resolve => require(['../../views/meetingList'], resolve),
    meta: {
      name: '会议列表',
      requireAuth: true
    }
  },
  {
    path: '/manager/meeting/add',
    name: 'addMeeting',
    component: resolve => require(['../../views/meetingList/page/addMeeting.vue'], resolve),
    meta: {
      name: '新建会议',
      requireAuth: true
    }
  }
]

export default meetingRouterList
