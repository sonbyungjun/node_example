import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from './plugins/customAxios'
import Toasted from 'vue-toasted'

// Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(Toasted, {
  position : "bottom-right",
  duration : 2500,
  action : {
    text : "닫기",
    onClick(e, toastObject) {
      toastObject.goAway(0);
    }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
