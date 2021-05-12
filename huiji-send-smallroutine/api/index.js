const apiList = {
    // 登录
    loginByPhone: '/user/loginByPhone', // 手机号登录
    // 通知
    noticeList: '/notice/noticeList', // 通知列表
    noticeDetail: '/notice/getNoticeDetail', // 通知详情
    // 会议
    meetingList: '/meeting/getRelevantMeetings', // 会议列表
    meetingDetail: '/meeting/getMeetingDetail', // 会议详情
    meetingSign: '/meeting/signMeeting', // 会议签到请假
}

export default apiList