// 这里定义全局变量
let startY = 0; // 开始距顶部的距离(手指起始的坐标)
let moveY = 0;// 结束距顶部距离(手指移动的坐标)
let moveDistance = 0;// 移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',// 过渡的距离
    coveTransition: '',// 过渡动画效果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 手指滑动开始事件
  handleTouchStart(event) {
    console.log(event,'开始');
    // 一进来把过渡效果清空,保证只有下拉的时候有效果
    this.setData({
      coveTransition: ''
    })
    // 获取手指起始的坐标
    // 这里event事件参数可以获取手指移动事件的一些参数 touches是一个数组,对应的元素个数,对应几个手指,取第一项就是一个手指(第一个手指)
    startY = event.touches[0].clientY
  },
  // 手指滑动事件
  handleTouchMove(event) {
    console.log(event,'ing');
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    // 限制往不能上滑的交互
    if (moveDistance < 0) {
      return
    }
    // 限制往下滑的距离,超过一定的距离就让滑动距离等于80,不能继续滑动
    if (moveDistance > 80) {
      moveDistance = 80
    }
    // 动态赋值给滑动距离来实现滑动效果
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  // 滑动结束事件
  handleTouchEnd(event) {
    console.log(event,'结束');
    // 滑动结束回到起点,利用css3的过渡效果
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'
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