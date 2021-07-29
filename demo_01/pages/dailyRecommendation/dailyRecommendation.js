import request from "../../utils/request";
// pages/dailyRecommendation/dailyRecommendation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',// 当前日期
    month:'',// 当前月份
    recommendationList:[],// 每日推荐列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo=wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 提示之后跳转登录页面
          wx.reLaunch({
            url:'/pages/login/login'
          })
        }
      })
    }
    let day=new Date().getDate()
    let month=new Date().getMonth()+1
    this.setData({
      day,
      month
    })
    // 获取推荐歌曲数据
    this.getRecommendationData()
  },
  // 获取推荐列表的数据
  async getRecommendationData (){
let recommendation =await request('/recommend/songs')
// console.log(recommendation);
this.setData({
  recommendationList:recommendation.recommend
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