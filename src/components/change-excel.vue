<template>
  <div class="hello">
    <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
  </div>
</template>

<script>

import XLSX from 'xlsx'
import {exportXlsx} from '@/utils';

export default {
  name: 'change-excel',
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
      if(files.length<=0){//如果没有文件名
        return false;
      } else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0];//取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          console.log(ws);
          const excelData = this.formatData(ws);
          console.log('excelData', excelData);
          exportXlsx(excelData, `${excelData[0][1]}-转换后`);
          this.$refs.upload.value = '';
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    formatData(ws) {
      console.log('111');
      const sTitle = Object.keys(ws[2])[1];
      const sData = [
          ['标题', sTitle],
          ['描述', ws[0][sTitle]],
          ['用时', ws[1][sTitle]],
      ]
      const oData = [];
      for(let i= 0;i<ws.length;i++){
        if (i >= 3) {
          const row = ws[i];
          // 表格标题
          // 选项标题
          let oTitle = row["标题"].replace(/([ABCDE])[:：.、]+/g, '$1、');
          const options = oTitle.match(/[ABCDE]、[^(?!A、)(?!B、)(?!C、)(?!D、)(?!E、)]+/g);
          // console.log(options, i);
          oTitle = oTitle.slice(0, oTitle.indexOf('A、'));
          const sheetData = {
            '题干': oTitle,
            '题型': row[sTitle],
          }
          for(let oi = 0; oi < 5; oi ++) {
            sheetData[`选项${oi + 1}`] = options[oi] || '';
          }
          sheetData['解析'] = row['__EMPTY_5'];
          sheetData['答案'] = row['__EMPTY_6'];
          sheetData['得分'] = row['__EMPTY_7'];
          oData.push(sheetData);
        }
      }
      return sData.concat([Object.keys(oData[0])]).concat(oData.map(v => Object.values(v)));
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
