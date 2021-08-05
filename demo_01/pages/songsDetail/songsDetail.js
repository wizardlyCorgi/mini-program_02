// pages/songsDetail/songsDetail.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,// 音乐是否播放控制摇杆
    detailsData: {},// 歌曲详情数据
    musicId: '',// 歌曲id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.songId
    this.setData({
      musicId
    })
    this.getSongDetails(musicId)
  },
  // 音乐播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    this.musicPlay(isPlay, this.data.musicId)
  },
  // 音乐播放/暂停功能函数
  async musicPlay(isPlay, musicId) {
    // 获取背景音频的全局对象
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlay) {
      // 1)播放的时候
      // 获取音乐的src(发送请求)
      let musicSrcData = await request('/song/url', { id: musicId })
      // 赋值必填属性title给背景音频实例对象
      backgroundAudioManager.title = this.data.detailsData.name
      // 赋值src给背景音频实例对象
      backgroundAudioManager.src = musicSrcData.data[0].url
    } else {
      // 2)暂停的时候
      // 调用实例对象的方法暂停播放
      backgroundAudioManager.pause()
    }
  },
  // 发送请求获取歌曲详情数据
  async getSongDetails(id) {
    let detailsData = await request('/song/detail', { ids: id })
    this.setData({
      detailsData: detailsData.songs[0]
    })
    // 动态设置导航栏文本==>展示歌曲名称
    wx.setNavigationBarTitle({
      title: this.data.detailsData.name
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