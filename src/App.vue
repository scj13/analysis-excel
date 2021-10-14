<template>
  <div id="app">
    <!--<change-excel />-->
    <json-to-csv />
  </div>
</template>

<script>

// import ChangeExcel from '@/components/change-excel';
import JsonToCsv from '@/components/json-to-csv';
export default {
  name: 'App',
  components: {
    JsonToCsv,
    // ChangeExcel
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
