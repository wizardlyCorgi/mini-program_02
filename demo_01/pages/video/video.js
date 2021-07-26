// pages/video/video.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//视频导航数据
    navId: '',//导航对应的id
    videoGroupDetailData: [],//视频详情数据 
    videoId: '',// 记录当前视频的id
    timeUpdateArr: []// 储存视频的当前播放时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  // 获取视频导航数据
  async getVideoGroupList() {
    let videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupList.data.slice(0, 14),
      navId: videoGroupList.data[0].id
    })
    // 获取视频数据
    this.getVideoGroupDetail(this.data.navId)
  },
  // 切换视频标签事件
  changeGroup(event) {
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId: navId * 1,// 转换为number类型
      videoGroupDetailData: []
    })
    wx.showLoading({
      title: '正在加载中...'
    })
    this.getVideoGroupDetail(this.data.navId)
  },
  // 获取视频数据
  async getVideoGroupDetail(navId) {
    let videoGroupDetail = await request('/video/group', { id: navId })
    let index = 0
    let videoGroupDetailData = videoGroupDetail.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoGroupDetailData
    })
    wx.hideLoading()
    // console.log(videoGroupDetail,'videoGroupDetail');
  },
  // 视频播放/继续播放的回调函数
  handelPlay(event) {
    let vId = event.currentTarget.id
    // 判断不是当前
    // this.vId !== vId && this.videoContext && this.videoContext.stop()
    // this.vId = vId
    this.setData({
      videoId: vId
    })
    this.videoContext = wx.createVideoContext(vId)
    console.log(this.videoContext, 'this.videoContextthis.videoContext');
    let { timeUpdateArr } = this.data
    let timeItem = timeUpdateArr.find(item => item.vid === vId)
    if (timeItem) {
      this.videoContext.seek(timeItem.currentTime)
    }
    this.videoContext.play()
  },
  // 监听播放的回调函数
  handleTimeUpdate(e) {
    // 获取事件对象中播放时间 detail.currentTime 并更新到this.data
    let currentTime = e.detail.currentTime
    let vid = e.currentTarget.id
    console.log(vid, 'vid');
    // 创建一个对象存储id与时间并添加到数组中去
    let timeUpdateItem = {
      vid,
      currentTime
    }
    let { timeUpdateArr } = this.data
    // console.log(timeUpdateArr,'timeUpdateArr');
    // 存储到数组中去
    // 判断
    // 1,是否已经有这个数组了,有的处理方法,没有的处理方法
    // 有就不继续添加元素,应该更新当前的时间(找到这个项的数组下标)
    let updateItem = timeUpdateArr.find(item => item.vid === timeUpdateItem.vid)
    if (updateItem) {
      updateItem.currentTime = currentTime
    } else {
      timeUpdateArr.push(timeUpdateItem)
    }
    this.setData({
      timeUpdateArr
    })
  },
  // 播放结束时的回调函数
  handelEnded(e) {
    // 播放结束的时候要把播放完的item从数组中清除
    let { timeUpdateArr } = this.data
    // 用id相同来寻找那一个元素的下标
    let endIndex = timeUpdateArr.findIndex(item => item.vid === e.currentTarget.id)
    timeUpdateArr.splice(endIndex, 1)
    this.setData({
      timeUpdateArr
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