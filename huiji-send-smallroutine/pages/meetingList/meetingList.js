// pages/meetingList/meetingList.js
import apiList from '../../api/index'
import service from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[],
    meetingList:[
      // status: 0（代进行） 1（正在进行）2（已结束）
    ],
    isShow: false,
    noticeTime: '2021/1/28 18:00',
    noticeTitle: '亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举',
    noticeContent: '亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举亚特选举'
  },
  // 打开会议详情
  getMeetingDetails(e){
    console.log(e);
    let data = e.currentTarget.dataset
    console.log(data.id);
    wx.navigateTo({
      url: `/pages/meetingDetail/index?meetingId=${data.id}`,
    })
  },
  // 打开通知详情
  toNoticeDetail(e){
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    console.log('toNoticeDetail => ',e);
    const params = {
      id: e.target.dataset.noticeid
    }
    console.log(params);
    service.get(apiList.noticeDetail,params).then(res => {
      if(res.data.code === 0){
        let obj = res.data.result
        obj.time = obj.time.split('.')[0].replace('T',' ')
        this.setData({
          noticeTime: obj.time,
          noticeTitle: obj.title,
          noticeContent: obj.content
        })
        wx.hideLoading();
        this.setData({
          isShow: true
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
      console.log(res);
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },
  // 关闭弹窗
  onClose(){
    this.setData({
      isShow: false
    })
  },
  // 初始化通知列表
  initNoticeList(){
    const params = {
      pageSize: 3,
      pageNum: 1
    }
    service.get(apiList.noticeList,params).then(res => {
      if(res.data.total > 0){
        let arr = res.data.pageData
        arr.forEach(item => {
          const timeArr = item.time.split('T')[0].split('-')
          item.fullTitle = `${timeArr[1]}-${timeArr[2]} | ${item.title}`
        })
        this.setData({
          noticeList: arr
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },
  // 初始化会议列表
  initMeetingList(){
    const params = {
      phone: wx.getStorageSync('userPhone')
    }
    service.simplePost(apiList.meetingList,params).then(res => {
      console.log(res);
      if(res.data.code === 0){
        let arr = res.data.result
        arr.forEach(item => {
          item.startTime = item.startTime.split('.')[0].replace('T',' ')
          item.endTime = item.endTime.split('.')[0].replace('T',' ')
        })
        this.setData({
          meetingList: arr
        })
        wx.hideLoading();
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '火速加载中~',
      mask: true,
    });
    this.initNoticeList()
    this.initMeetingList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})