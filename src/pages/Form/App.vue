<template>
  <div id="app">
      <Form />
  </div>
</template>

<script>
import Form from '../../components/Form.vue'

export default {
  name: 'App',
  components: {
    Form
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