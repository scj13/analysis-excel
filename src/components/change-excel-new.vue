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
      outputs: [],
      sTitle: '',
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

      this.sTitle = files[0].name.split('.')[0];

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          for(let i = 0; i < workbook.SheetNames.length; i ++) {
            const wsname = workbook.SheetNames[i];//取第一张表
            // eslint-disable-next-line no-debugger
            // debugger;
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
            console.log(ws);
            const excelData = this.formatData1(ws, wsname);
            console.log('excelData', excelData);
            exportXlsx(excelData, `${excelData[0][1]}-转换后`);
            this.$refs.upload.value = '';
          }
          // const wsname = workbook.SheetNames[0];//取第一张表
          // // eslint-disable-next-line no-debugger
          // debugger;
          // const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          // console.log(ws);
          // const excelData = this.formatData(ws);
          // console.log('excelData', excelData);
          // exportXlsx(excelData, `${excelData[0][1]}-转换后`);
          // this.$refs.upload.value = '';
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    formatData(ws) {
      console.log('111');
      // const sTitle = Object.keys(ws[2])[1];
      const sTitle = this.sTitle;
      const sData = [
          ['标题', sTitle],
          ['描述', ''],
          ['用时', 888888],
      ]
      const oData = [];
      for(let i= 0;i<ws.length;i++){
        if (i >= 0) {
          const row = ws[i];
          // 表格标题
          // 选项标题
          let oTitle = row["题目内容"].replace(/([ABCDE])[:：.、]+/g, '$1、');
          const options = oTitle.match(/[ABCDE]、[^(?!A、)(?!B、)(?!C、)(?!D、)(?!E、)]+/g);
          // console.log(options, i);
          oTitle = oTitle.slice(0, oTitle.indexOf('A、'));
          const sheetData = {
            '题干': oTitle,
            '题型': '顺序选择题',
          }
          if (row['题目类型'] === '判断') {
            sheetData['选项1'] = '正确';
            sheetData['选项2'] = '错误';
            sheetData['选项3'] = '';
            sheetData['选项4'] = '';
            sheetData['选项5'] = '';
          } else {
            for(let oi = 0; oi < 5; oi ++) {
              sheetData[`选项${oi + 1}`] = options[oi]?.replace(/[ABCDE]、(.*)/g, '$1') || '';
            }
          }
          sheetData['解析'] = '';
          if (row['题目类型'] === '判断') {
            sheetData['答案'] = row['正确答案'] === '正确' ? 'A' : 'B';
          } else {
            sheetData['答案'] = row['正确答案'];
          }
          sheetData['得分'] = 1;
          oData.push(sheetData);
        }
      }
      return sData.concat([Object.keys(oData[0])]).concat(oData.map(v => Object.values(v)));
    },
    formatData1(ws, wsname) {
      console.log('111');
      // const sTitle = Object.keys(ws[2])[1];
      const sTitle = `${this.sTitle}-${wsname}`;
      const sData = [
          ['标题', sTitle],
          ['描述', ''],
          ['用时', 888888],
      ]
      const oData = [];
      for(let i= 0;i<ws.length;i++){
        if (i >= 0) {
          const row = ws[i];
          // 表格标题
          // 选项标题
          let oTitle = row["题目内容"].replace(/([ABCDE])[:：.、]+/g, '$1、');
          const options = oTitle.match(/[ABCDE]、[^(?!A、)(?!B、)(?!C、)(?!D、)(?!E、)]+/g);
          // console.log(options, i);
          oTitle = oTitle.slice(0, oTitle.indexOf('A、'));
          const sheetData = {
            '题干': oTitle,
            '题型': '顺序选择题',
          }
          if (wsname=== '判断') {
            sheetData['选项1'] = '正确';
            sheetData['选项2'] = '错误';
            sheetData['选项3'] = '';
            sheetData['选项4'] = '';
            sheetData['选项5'] = '';
          } else {
            for(let oi = 0; oi < 5; oi ++) {
              sheetData[`选项${oi + 1}`] = options[oi]?.replace(/[ABCDE]、(.*)/g, '$1') || '';
            }
          }
          sheetData['解析'] = row['备注'];
          if (wsname === '判断') {
            sheetData['答案'] = row['答案'] === '正确' ? 'A' : 'B';
          } else {
            sheetData['答案'] = row['答案'];
          }
          sheetData['得分'] = 1;
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
