import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'

const VueInputMask = require('vue-inputmask').default

Vue.use(Vuelidate)
Vue.use(VueInputMask)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
