// pages/login/login.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 收集表单的函数
  handleInput(e) {
    // 获取用户输入的input的类型
    // 第一种方法 id属性
    // let type = e.currentTarget.id
    // 第二种方法 data-xx属性
    let type = e.currentTarget.dataset.type
    // 赋值给data中的变量
    // [type]取变量作为键,自行匹配
    this.setData({
      [type]: e.detail.value
    })
  },
  // 登陆事件
  async login(e) {
    let { phone, password } = this.data
    // 为空判断
    if (!phone) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      })
      return
    }
    let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号码不正确,请确认',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    // 后端验证
    let res=await request('/login/cellphone',{phone,password})
    if (res.code===200) {
      wx.showToast({
      title: '登陆成功'
    })
    // 存储个人信息到本地
    wx.setStorageSync('userInfo',JSON.stringify(res.profile))
    wx.reLaunch({
      url:'/pages/personal/personal'
    })
    } else if(res.code===400) {
      wx.showToast({
        title: '手机号码错误',
        icon:'none'
      })
    }else if(res.code===502){
      wx.showToast({
        title:res.msg,
        icon:'none'
      })
    }else {
      wx.showToast({
        title: '登陆失败,请重试',
        icon:'none'
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