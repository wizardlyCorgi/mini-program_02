import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerArray: [],//轮播图数据
    recommendList:[],//推荐歌单数据
    topList:[]// 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerArray = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerArray:bannerArray.banners
    })
    // 获取推荐歌单数据
    let recommendList= await request('/personalized')
    this.setData({
      recommendList:recommendList.result
    })
    // 排行榜数据
    // 构造适合的数据
    let resultData=[]
    let index=0
    while (index<5) {
      let topList= await request('/top/list',{idx:index++})
      let musicItem= {
        name:topList.playlist.name,
        itemArr:topList.playlist.tracks.slice(0,3)
      }
      resultData.push(musicItem)
      this.setData({
        topList:resultData
      })
    }
    
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