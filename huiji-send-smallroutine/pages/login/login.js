// pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authCode: '', // 验证码栏
    ruleMobile: false, // 手机验证是否通过
    phoneNumber: null,
    codeStatus: false, // 验证码状态
    codeDate: 60, // 验证码获取时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    
  },
  /**
   * 获取验证码
   */ 
  clickShow(){
    let lclearDate
    const regex = /^1[3456789]\d{9}$/
    if(!regex.test(this.data.phoneNumber)){
      let title = '手机号码有误!'
      if(this.data.phoneNumber === '') title = '请输入手机号码!'
      wx.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.codeStatus) return
    this.setData({
      codeStatus: true,
      ruleMobile: true
    })
    if(this.data.codeStatus){
      let time = this.data.codeDate
      
      lclearDate = setInterval(()=>{
        --time
        this.setData({
          codeDate: time
        })
        if(this.data.codeDate === 0){
          this.setData({
            codeStatus: false,
            codeDate: 60
          })
          clearInterval(lclearDate);
        }
      },1000)
    }
  },
  login(){
    wx.setStorageSync("userPhone",this.data.phoneNumber)
    wx.switchTab({
      url: '/pages/meetingList/meetingList'
    })
  }
})