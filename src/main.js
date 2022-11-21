import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import gasApi from './api'
Vue.prototype.$gas = gasApi

import dayjs from 'dayjs'
import 'dayjs/locale/ja'
dayjs.locale('ja')
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
