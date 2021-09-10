import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'selectize/dist/css/selectize.default.css' // This is required, we use the same css as selectize.js
import VSelectize from '@isneezy/vue-selectize'
import Vue from 'vue'
import App from './App.vue'
// import Axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'


Vue.config.productionTip = false

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Vue-selectize
Vue.component('v-selectize', VSelectize)

Vue.component('backoffice', require('./components/Backoffice.vue').default);


new Vue({
  render: h => h(App),
}).$mount('#app')
