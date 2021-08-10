// pages/search/search.js
import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '搜索歌曲',// 默认的占位符
    hotList: [],// 热搜榜数据
    keyWordsData: [],// 关键词搜索数据
    keyWords: '',// 搜索关键词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化占位符数据
    this.getPlaceholderContent()
    // 获取热搜榜列表数据
    this.getHotListData()
  },
  // 获取初始化占位符数据
  async getPlaceholderContent() {
    let placeholderData = await request('/search/default')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword
    })
  },
  // 获取热搜榜列表数据
  async getHotListData() {
    let hotListData = await request('/search/hot/detail')
    this.setData({
      hotList: hotListData.data
    })
  },
  // 输入搜索回调
  handleInput(e) {
    let keyWords = e.detail.value.trim()
    if (!keyWords) {
      this.setData({
        keyWordsData: []
      })
      return
    }
    this.setData({
      keyWords
    })

    // 函数节流
    // 第一次进来不走return 
    // 继续往下执行,发送请求之后,
    // 等待计时器把isSend重置为false,
    // 才能继续发请求
    if (isSend) {
      return
    }
    isSend = true
    this.getKeyWordsData()
    setTimeout(() => {
      isSend = false
      // 约定成俗300毫秒
    }, 300)

  },
  // 取消搜索
  canselSearch(){
    // 跳回视频页面
    // this.setData({
    //   keyWordsData: []
    // })
  },
  // 获取关键词搜索数据
  async getKeyWordsData() {
    let keywords = this.data.keyWords
    let res = await request('/search', { keywords, limit: 10 })
    let keyWordsData = res.result.songs
    this.setData({
      keyWordsData
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