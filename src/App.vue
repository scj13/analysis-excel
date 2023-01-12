<template>
  <div id="app">
<!--    <change-excel />-->
<!--    <json-to-csv />-->
<!--    <change-excel-new />-->
    <compare-excel />
  </div>
</template>

<script>

// import ChangeExcel from '@/components/change-excel';
// import ChangeExcelNew from '@/components/change-excel-new';
// import JsonToCsv from '@/components/json-to-csv';
import CompareExcel from '@/components/compare-excel';
export default {
  name: 'App',
  components: {
    // JsonToCsv,
    // ChangeExcel,
    // ChangeExcelNew,
    CompareExcel
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
