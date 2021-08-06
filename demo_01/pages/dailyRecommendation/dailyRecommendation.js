import PubSub from 'pubsub-js'
import request from "../../utils/request";
// pages/dailyRecommendation/dailyRecommendation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',// 当前日期
    month: '',// 当前月份
    recommendationList: [],// 每日推荐列表数据
    index: '',// 推荐歌曲数组的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 提示之后跳转登录页面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    this.setData({
      day,
      month
    })
    // 获取推荐歌曲数据
    this.getRecommendationData()
    // 订阅songDetail发布的type类型是上一首还是下一首
    PubSub.subscribe('songDetailType', (msg, type) => {
      // 根据songDetail发布的type经过下标获取歌曲的id
      let { index, recommendationList } = this.data
      if (type === 'pre') {
        // 要考虑临界值,第一首的上一首是最后一首即数组的length
        (index === 0)&&(index=recommendationList.length)
        index -= 1
      } else {
        (index === recommendationList.length-1)&&(index = -1)
        index += 1
      }
      // 更新下标,不然会出bug
      this.setData({
        index
      })
      // 发布歌曲id给songDetail接收(取消订阅)
      let musicId=recommendationList[index].id
      PubSub.publish('musicId',musicId)
    })
  },
  // 获取推荐列表的数据
  async getRecommendationData() {
    let recommendation = await request('/recommend/songs')
    // console.log(recommendation);
    this.setData({
      recommendationList: recommendation.recommend
    })
  },
  // 路由跳转到歌曲详情
  toSongDetails(event) {
    // 获取事件对象传入的item中的id
    let musicId = event.currentTarget.dataset.song.id
    let index = event.currentTarget.dataset.index
    this.setData({
      index
    })
    // 跳转歌曲详情页面并带上参数id
    wx.navigateTo({
      url: '/pages/songsDetail/songsDetail?songId=' + musicId,
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