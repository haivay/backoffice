<template>
  <div id="app">
      <Backoffice />
      <Data />
  </div>
</template>

<script>
import Backoffice from '../../components/Backoffice.vue'
import Data from '../../components/Data.vue'

export default {
  name: 'App',
  components: {
    Backoffice,
    Data
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #212529;
  margin-top: 60px;
}
.selectize-dropdown, .selectize-input, .selectize-input input  {
    font-size: inherit;
    cursor: pointer;
  }
</style>