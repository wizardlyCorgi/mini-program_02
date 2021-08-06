// pages/songsDetail/songsDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from "../../utils/request";
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,// 音乐是否播放控制摇杆
    detailsData: {},// 歌曲详情数据
    musicId: '',// 歌曲id
    musicUrl: '',// 歌曲链接
    currentTime: '00:00',// 当前时间
    durationTime: '00:00',// 总时长
    currentWidth: 0,// 播放长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取背景音频的全局对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    let musicId = options.songId
    // 判断是否是之前播放过的那首歌,比对id
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }
    else {
      // console.log(111);
       // 进来就播放这首歌
    this.musicPlay(true, musicId)
    this.backgroundAudioManager.play()
    // console.log(232);
    }
    
    // 监听播放事件
    this.backgroundAudioManager.onPlay(() => {
      // 给isPlay赋值
      this.toSetIsPlay(true)
      // 存储当前歌曲的信息以及状态
      appInstance.globalData.musicId = musicId
    })
    // 监听暂停事件
    this.backgroundAudioManager.onPause(() => {
      // 给isPlay赋值
      this.toSetIsPlay(false)
    })
    // 监听关闭事件
    this.backgroundAudioManager.onStop(() => {
      // 给isPlay赋值
      this.toSetIsPlay(false)
    }),
      // 监听关闭事件
      this.backgroundAudioManager.onEnded(() => {
        console.log('我结束了');
        //  切换下一首歌
        // 发布type类型
        PubSub.publish('songDetailType', 'next')
        // 订阅推荐歌曲发布的musicId
        PubSub.subscribe('musicId', (msg, id) => {
          // 获取下一首/上一首的歌曲信息
          this.getSongDetails(id)
          // 获取上一首/下一首歌曲的url并播放
          this.musicPlay(true, id)
          PubSub.unsubscribe('musicId')
        })
        // 还原变量
        this.setData({
          currentTime: '00:00',// 当前时间
          currentWidth: 0,// 播放长度
        })
      }),

      // 监听时长变化
      this.backgroundAudioManager.onTimeUpdate(() => {
        let currentTime = this.backgroundAudioManager.currentTime
        let durationTime = this.backgroundAudioManager.duration
        // 计算播放的长度 百分比(当前播放时长与总时长的比等于播放的长度与总长度的比)
        let currentWidth = (currentTime / durationTime) * 450
        currentTime = moment(currentTime * 1000).format("mm:ss")
        this.setData({
          currentTime,
          currentWidth
        })
      })
    this.setData({
      musicId
    })
    this.getSongDetails(musicId)
    // this.handleMusicPlay()
  },
  // isPlay赋值的函数抽取
  toSetIsPlay(boo) {
    let isPlay = boo
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = boo
  },
  // 音乐播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    let { musicId, musicUrl } = this.data
    this.musicPlay(isPlay, musicId, musicUrl)
  },
  // 音乐播放/暂停功能函数
  async musicPlay(isPlay, musicId, musicUrl) {
    if (isPlay) {
      // 1)播放的时候
      if (!musicUrl) {
        // 获取音乐的src(发送请求)
        let musicSrcData = await request('/song/url', { id: musicId })
        musicUrl = musicSrcData.data[0].url
        this.setData({
          musicUrl,
        })
        // 赋值src给背景音频实例对象
       this.backgroundAudioManager.src = musicUrl
      }
       // 赋值必填属性title给背景音频实例对象
       this.backgroundAudioManager.title = this.data.detailsData.name
       
       console.log(musicUrl);
       console.log(this.backgroundAudioManager);
       console.log(this.backgroundAudioManager.src,11);
      // if (!this.data.musicUrl) {
      //   // 停止播放歌曲
      //   this.backgroundAudioManager.stop()
      //   wx.showToast({
      //     title: '歌曲不存在,请点击下一首',
      //     icon: 'none'
      //   })
      //   return
      // } else {
      //   // 赋值必填属性title给背景音频实例对象
      //   this.backgroundAudioManager.title = this.data.detailsData.name
      //   // 赋值src给背景音频实例对象
      //   this.backgroundAudioManager.src = musicUrl
      // }
    } else {
      // 2)暂停的时候
      // 调用实例对象的方法暂停播放
      this.backgroundAudioManager.pause()
    }
  },
  // 发送请求获取歌曲详情数据
  async getSongDetails(id) {
    let detailsData = await request('/song/detail', { ids: id })
    let durationTime = detailsData.songs[0].dt
    durationTime = moment(durationTime).format("mm:ss")
    this.setData({
      detailsData: detailsData.songs[0],
      durationTime
    })
    // 动态设置导航栏文本==>展示歌曲名称
    wx.setNavigationBarTitle({
      title: this.data.detailsData.name
    })
  },
  // 切换歌曲
  handleSwitch(e) {
    // 停止播放歌曲
    this.backgroundAudioManager.stop()
    let type = e.currentTarget.id
    // 发布type类型,即事件id
    PubSub.publish('songDetailType', type)
    // 订阅推荐歌曲发布的musicId
    PubSub.subscribe('musicId', (msg, id) => {
      // 获取下一首/上一首的歌曲信息
      this.getSongDetails(id)
      // 获取上一首/下一首歌曲的url并播放
      this.musicPlay(true, id)
      PubSub.unsubscribe('musicId')
    })
    // 根据musicId重新发送请求获取歌曲信息
  },
  // 手指移动事件
  handleMove(e) {
    console.log(e);
    console.log(111);
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
    // this.handleMusicPlay()
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