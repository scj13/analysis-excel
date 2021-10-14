<template>
  <div class='hello'>
    json => csv：
    <input type='file' ref='upload' accept='.json' datatype='application/json'>
  </div>
</template>

<script>
import { exportCsv } from '@/utils';

export default {
  name: 'json-to-csv',
  data() {
    return {
      outputs: [],
    };
  },
  mounted() {
    this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
      this.readExcel(e);
    });
  },
  methods: {
    readExcel(e) {//表格导入
      const files = e.target.files;
      console.log(files);
      if (files.length <= 0) {//如果没有文件名
        return false;
      } else if (!/\.json$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传json格式');
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          console.log(data);
          const csvData = this.formatData(data);
          console.log(csvData, files)
          exportCsv(csvData, `${files[0].name.replace('.json', '')}`);
          this.$refs.upload.value = '';
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsText(files[0]);
    },
    formatData(data) {
      console.log('111');
      const titleKeys = data.reduce((acc, cur) => {
        const curKeys = Object.keys(cur);
        return [...new Set(acc.concat(curKeys))]
      }, []);
      console.log('titleKeys', titleKeys);
      const sData = [];
      for (let i = 0; i < data.length; i++) {
        const row = titleKeys.map(v => data[i][v] || '');
        sData.push(row);
      }
      return [titleKeys].concat(sData);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
