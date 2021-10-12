import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'selectize/dist/css/selectize.default.css' // This is required, we use the same css as selectize.js
import VSelectize from '@isneezy/vue-selectize'
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
//fontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons'
import { faGripLines, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTrashAlt, faEdit, faGripLines, faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Vue-selectize
Vue.component('v-selectize', VSelectize)

Vue.component('backoffice', require('../../components/Backoffice.vue').default);


new Vue({
  render: h => h(App),
}).$mount('#app')