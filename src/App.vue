<template>
  <div id="app">
      <Backoffice />
      <!-- <hr> -->
      <!-- <FormEditor /> -->
  </div>
</template>

<script>
import Backoffice from './components/Backoffice.vue'
// import FormEditor from './components/FormEditor.vue'

export default {
  name: 'App',
  components: {
    Backoffice,
    // FormEditor
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