// 二版防抖-非立即执行版
export function debouncetwo(func, wait = 1000) {
  let timeout = null
  return function () {
    let _self = this
    let args = arguments
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      func.apply(_self, args)
    }, wait)
  }
}

// 防抖-立即执行版
export function debouncenow(func,wait = 1000){
  let timeout = null
  return function(){
    let _self = this
    let args = arguments
    if(timeout){
      clearTimeout(timeout)
    }
    let callnow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    },wait)
    
    if(callnow){
      func.apply(_self,args)
    }
  }
}