<template>
  <div id="app">
    <change-excel />
  </div>
</template>

<script>

import ChangeExcel from '@/components/change-excel';
export default {
  name: 'App',
  components: {
    ChangeExcel
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
