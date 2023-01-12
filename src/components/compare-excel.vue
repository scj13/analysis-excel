<template>
  <div class="hello">
    <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
  </div>
</template>

<script>

import XLSX from 'xlsx'
import {exportXlsx} from '@/utils';

export default {
  name: 'compare-excel',
  data () {
    return {
      outputs: []
    }
  },
  mounted() {
    this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
      this.readExcel(e);
    })
  },
  methods: {
    readExcel(e) {//表格导入
      const files = e.target.files;
      console.log(files);
      const name = files[0]?.name || '';
      if(files.length<=0){//如果没有文件名
        return false;
      } else if(!/\.(xls|xlsx)$/.test(name.toLowerCase())){
        window.alert('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          console.log(workbook);
          const wsname = workbook.SheetNames[0];//取第一张表
          const ws = XLSX.utils.sheet_to_csv(workbook.Sheets[wsname]);//生成json表格内容
          // console.log(ws);
          const excelData = this.formatData(ws);
          // console.log('excelData', excelData);
          exportXlsx(excelData, `${name.slice(0, name.lastIndexOf('.'))}-对比后`);
          this.$refs.upload.value = '';
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    formatData(ws) {
      const arr = ws.split('\n');
      const arr1 = arr.map(v => v.split(',')[0]);
      const arr2 = arr.map(v => v.split(',')[1]);
      console.log(arr1, arr2);
      const arr3 = arr1.filter(v => v && !arr2.includes(v));
      const arr4 = arr2.filter(v => v && !arr1.includes(v));
      return arr1.map((v, i) => [v, arr2[i], arr3[i], arr4[i]]);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
