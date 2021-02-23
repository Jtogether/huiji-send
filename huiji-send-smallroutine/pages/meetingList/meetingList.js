// pages/meetingList/meetingList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fakeNoticeList:[
      {title:"1-29 | 技术是开发的基础。",createPerson:"l2"},
      {title:"1-29 | 开发它的人的可太怪了。",createPerson:"l3"},
    ],
    fakeMeetingList:[
      // status: 0（代进行） 1（正在进行）2（已结束）
      {id:'0a1sd65f1a65sdf',title:"亚特兰蒂斯万岁",address:"亚特兰蒂斯社区大堂",timing:"2021/1/28 18:00 ~ 2021/1/28 18:30",status:0},
      {id:'1asdf13a5sd1f6',title:"亚特选举",address:"亚特兰蒂斯社区大堂",timing:"2021/1/28 18:00 ~ 2021/1/28 18:30",status:0},
      {id:'2fa1sd65f161sdf',title:"兰斯辩论",address:"亚特兰蒂斯社区大堂",timing:"2021/1/28 18:00 ~ 2021/1/28 18:30",status:1},
      {id:'3a1ds6f51a6dsf',title:"关于部分时间的说明通告",address:"亚特兰蒂斯社区大堂",timing:"2021/1/28 18:00 ~ 2021/1/28 18:30",status:2},
    ]
  },
  getMeetingDetails(e){
    console.log(e);
    let data = e.currentTarget.dataset
    console.log(data.id);
    wx.navigateTo({
      url: `/pages/meetingDetail/index?meetingId=${data.id}`,
    })
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

  }
})