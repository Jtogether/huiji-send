// pages/userinfo/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [
      {
        name: '呼叫手机号',
        tapStatus: 0
      },
      {
        name: '复制手机号',
        tapStatus: 1
      },
    ],
    adminPhone: '13025818479',
    userInfo: {},
    hasUserInfo: false,
  },
  tapShow(){
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    switch (event.detail.tapStatus) {
      case 0:
        wx.makePhoneCall({
          phoneNumber: this.data.adminPhone
        });
        break;
      case 1:
        wx.setClipboardData({
          data: this.data.adminPhone,
          success: (result)=>{
            if(result.errMsg === 'setClipboardData:ok'){
              wx.showToast({
                title: '复制成功',
                icon: 'none',
                image: '',
                duration: 1000,
                mask: false,
              });
            }else{
              wx.showToast({
                title: result.errMsg,
                icon: 'none',
                image: '',
                duration: 1000,
                mask: false,
              });
            }
          }
        });
        break;
      default:
        break;
    }
  },
  getUserProfile(e) {
    if(this.data.userInfo.nickName !== '微信用户') return
    console.log(e);
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息及用于投诉建议功能', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        console.log(res.userInfo.nickName)
        console.log(typeof res.userInfo.nickName)

        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
        });
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
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