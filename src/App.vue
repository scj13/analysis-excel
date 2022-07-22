<template>
  <div id="app">
<!--    <change-excel />-->
<!--    <json-to-csv />-->
    <change-excel-new />
  </div>
</template>

<script>

// import ChangeExcel from '@/components/change-excel';
import ChangeExcelNew from '@/components/change-excel-new';
// import JsonToCsv from '@/components/json-to-csv';
export default {
  name: 'App',
  components: {
    // JsonToCsv,
    // ChangeExcel,
    ChangeExcelNew,
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
