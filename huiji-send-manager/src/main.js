import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/js/tool.js'
import api from './api'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$api = api // 挂载全局api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
