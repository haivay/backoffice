<template>
  <div id="app">
    <Backoffice />
  </div>
</template>

<script>
import Backoffice from './components/Backoffice'

export default {
  name: 'App',
  components: {
    Backoffice
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #212529;
  margin-top: 60px;
}
</style>