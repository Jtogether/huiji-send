// 引入拦截器
import Ajax from '@/utils/fetch'

const apiList = {
  // 后台登录
  systemLogin (params) {
    return Ajax({
      url: '/user/login',
      method: 'post',
      params
    })
  },
  // 会议管理-获取会议列表
  getMeetingList (params) {
    return Ajax({
      url: '/meeting/getMeetingList',
      method: 'get',
      params
    })
  },
  // 会议管理-新增会议
  addMeeting (params) {
    const data = params
    return Ajax({
      url: '/meeting/addMeetings',
      method: 'post',
      data
    })
  },
  // 会议管理-更新会议
  updateMeeting (params) {
    const data = params
    return Ajax({
      url: '/meeting/updateMeetings',
      method: 'post',
      data
    })
  },
  // 会议管理-删除会议
  deleteMeeting (params) {
    return Ajax({
      url: '/meeting/deleteMeeting',
      method: 'delete',
      params
    })
  },
  // 会议管理-获取会议详情
  getMeetingDetails (params) {
    return Ajax({
      url: '/meeting/getMeetingDetail',
      method: 'get',
      params
    })
  },
  // 通知管理-通知列表
  getNoticeList (params) {
    return Ajax({
      url: '/notice/noticeList',
      method: 'get',
      params
    })
  },
  // 通知管理-新增通知
  addNotice (params) {
    const data = params
    return Ajax({
      url: '/notice/addNotice',
      method: 'post',
      data
    })
  },
  // 通知管理-获取通知详情
  getNoticeDetail (params) {
    return Ajax({
      url: '/notice/getNoticeDetail',
      method: 'get',
      params
    })
  },
  // 通知管理-更新通知
  updateNotice (params) {
    const data = params
    return Ajax({
      url: '/notice/updateNotice',
      method: 'post',
      data
    })
  },
  // 通知管理-删除通知
  deleteNotice (params) {
    return Ajax({
      url: '/notice/deleteNotice',
      method: 'delete',
      params
    })
  },
  // 人员管理-获取人员列表
  getPersonList (params) {
    return Ajax({
      url: '/user/getPersonList',
      method: 'get',
      params
    })
  },
  // 人员管理-获取人员详情
  getPersonInfo (params) {
    return Ajax({
      url: '/user/getPhone',
      method: 'get',
      params
    })
  },
  // 人员管理-新增人员
  addPersons (params) {
    const data = params
    return Ajax({
      url: '/user/addPeople',
      method: 'post',
      data
    })
  },
  // 人员管理-删除人员
  deletePerson (params) {
    return Ajax({
      url: '/user/deletePerson',
      method: 'get',
      params
    })
  },
  // 人员管理-更新人员信息
  updatePerson (params) {
    return Ajax({
      url: '/user/updatePerson',
      method: 'get',
      params
    })
  }
}

export default apiList
