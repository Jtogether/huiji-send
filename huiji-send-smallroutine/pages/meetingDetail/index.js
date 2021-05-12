// pages/meetingDetail/index.js
import apiList from '../../api/index'
import service from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 会议页面数据
    meetingId:'',
    title: '',
    content: '',
    address: '',
    startTime: '',
    endTime: '',
    status: 0, // 会议状态
    curUserStatus: 0, // 0未签到 1已签到 2已请假
    // 请假相关
    reason: '', // 请假理由
    show: false
  },
  // 签到请假
  signIn(e){
    if(!this.data.meetingId) return
      const params = {
        meetingId: this.data.meetingId,
        phone: wx.getStorageSync('userPhone'),
        isSign: e.target.dataset.action,
        reseaon: e.target.dataset.action === '2' ? this.data.reason : ''
      }
    service.simplePost(apiList.meetingSign,params).then(res => {
      if(res.data.code === 0){
        let curTitle
        switch (e.target.dataset.action) {
          case '0':
            curTitle = '取消签到成功'
            break;
          case '1':
            curTitle = '签到成功'
            break;
          case '2':
            curTitle = '请假成功'
            break;
          default:
            break;
        }
        wx.showToast({
          title: curTitle,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        setTimeout(() => {
          this.init()
        },1000)
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        setTimeout(() => {
          this.init()
        },1000)
      }
    }).catch(err => {
      console.log(err);
    })
  },
  // 打开请假框
  openDialog(){
    if(this.data.curUserStatus === 2) return
    this.setData({
      show:true
    })
  },
  // 关闭请假框
  onClose(){
    this.setData({
      show:false,
      reason: ''
    })
  },
  // 初始化页面数据
  init(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    const params = {
      meetingId: this.data.meetingId
    }
    service.get(apiList.meetingDetail,params).then(res => {
      if(res.data.code === 0){
        let obj = res.data.result
        // 时间处理
        obj.startTime = obj.startTime.split('.')[0].replace('T',' ')
        obj.endTime = obj.endTime.split('.')[0].replace('T',' ')
        // 当前人物状态处理
        let userStatus
        let userPhone = wx.getStorageSync('userPhone');
        obj.personList.forEach(item => {
          if(item.phone === userPhone){
            userStatus = item.isSign
          }
        })
        this.setData({
          meetingId:obj.meetingId,
          title: obj.title,
          content: obj.title,
          address: obj.address,
          startTime: obj.startTime,
          endTime: obj.endTime,
          status: obj.status, // 会议状态
          curUserStatus: userStatus // 0未签到 1已签到 2已请假
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
      console.log(res);
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      meetingId: options.meetingId
    })
    this.init()
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