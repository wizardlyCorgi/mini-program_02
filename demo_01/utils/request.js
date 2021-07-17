import config from './config'
export default (url, data = {}, method = 'GET')=>{
  return new Promise((resolve, reject)=> {
    // 1, new Promise初始化promise实例的状态为pending
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (res) => {
        // resolve修改promise的状态为成功状态 resolved
        resolve(res.data)
      },
      fail: (err) => {
        // reject修改promise的状态为失败状态 rejected
        reject(err)
      }
    })
  })

}