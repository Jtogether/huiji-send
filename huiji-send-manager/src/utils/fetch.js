// request 拦截器
import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  timeout: null // 请求超时时间
})
let serviceTips

// requeset 拦截器
service.interceptors.request.use(
  config => {
    // 获取本地token
    const token = sessionStorage.getItem('resToken')
    // 设置请求头
    let headers = 'application/json'
    // 是否携带token
    let tokenFlag = true
    // // 防止IE浏览器获取到缓存数据
    // if (config.url.indexOf('?time') < 1) {
    //   if (config.url.indexOf('?') < 1) {
    //     config.url += '?time=' + new Date().getTime()
    //   } else {
    //     config.url += '&time=' + new Date().getTime()
    //   }
    // }
    // 是否修改请求信息
    if (config.opts) {
      // 获取携带token状态
      tokenFlag = config.opts ? config.opts.token : true
      // 获取请求头
      headers = config.opts.Header ? config.opts.Header : 'application/json'
      // 拓展头部参数
      const Head = config.opts.Head
      if (Head) {
        for (const key in Head) {
          config.headers[key] = Head[key]
          if (key === 'Content-Type') {
            headers = Head[key]
          }
        }
      }
    }
    if (token && tokenFlag) {
      // 条件允许，携带token请求
      // config.headers['token'] = token
      config.headers.Passport = token
    } else {
      // headers = 'applicaiton/x-www-form-urlencoded'
    }
    // 设置请求格式
    config.headers['Content-Type'] = headers
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 服务器响应拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.message && error.message.includes('timeout')) {
      // 判断请求异常信息中是否含有超时timeout字符串
      serviceTips = '请求超时，请检查网络是否可用！'
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          error.response.data = '登录超时，请重新登录'
          window.location.href = window.location.origin
          // router.replace({
          //   path: '/login',
          //   query: {
          //     // redirect: router.currentRoute.fullPath
          //   } // 登录成功后跳入浏览的当前页面
          // })
          break
        case 404:
          error.response.data = '资源不存在'
          break
        case 406:
          error.response.data = '头部无携带token'
          break
        case 412:
          localStorage.removeItem('tokendata')
          window.location.href = window.location.origin
          // router.replace({
          //   path: '/login',
          //   query: {
          //     // redirect: router.currentRoute.fullPath
          //   } // 登录成功后跳入浏览的当前页面
          // })
          error.response.data = '秘钥失效'
          localStorage.removeItem('tokendata')
          break
        case 415:
          error.response.data = '请求type有误'
          break
        case 500:
          error.response.data = '服务器异常'
          break
        case 403:
          error.response.data = 'token已过期'
          sessionStorage.removeItem('resToken')
          location.reload()
          console.log(this.$router)
          break
      }
      serviceTips = error.response.data
    }
    if (serviceTips && serviceTips.length > 0) {
      Message.error(serviceTips)
    }
    return Promise.reject(serviceTips)
  }
)
export default service
