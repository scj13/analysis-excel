import XLSX from 'xlsx';
export async function exportXlsx(data, filename) {
  const sheetName = !filename || filename.length > 8 ? 'Sheet1' : filename;
  const sheet = XLSX.utils.aoa_to_sheet(data);
  console.log(sheet);
  const blob = sheetToblob(sheet, sheetName, XLSX);
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.xlsx`;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheetToblob(sheet, sheetName, XLSX) {
  sheetName = sheetName || 'sheet1';
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  // 字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  return new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
}

// 导出csv
export const exportCsv = (data, filename) => {
  let str = '';
  console.time('forEach');
  data.forEach((arr) => {
    str += `${arr.reduce((acc, cur, i) => {
      const ret = `${acc}${i !== 0 ? ',' : ''}`;
      let val = cur;
      if (!isNaN(Number(cur))) {
        // 大整数在csv里面会失真，所以加个空格
        if (!Number.isSafeInteger(Number(cur))) {
          val = `"${cur}"\t`;
        }
      } else {
        // csv会根据分隔符（半角逗号、半角分号、空格、tab等）去分隔单元格，所以用双引号包起来
        if (typeof cur === 'string' && /[,;\r\n]/.test(cur)) {
          val = cur.replace(/,/g, '，').replace(/;/g, '；')
            .replace(/[\r\n]/g, ' ');
        }
      }
      return `${ret}${val}`;
    }, '')}\r\n`;
  });
  console.timeEnd('forEach');
  str = getDownloadUrl(str);
  const link = document.createElement('a');
  link.setAttribute('href', str);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
};

function getDownloadUrl(str) {
  const utf = '\uFEFF'; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
  if (window.Blob && window.URL && window.URL.createObjectURL) {
    const csvData = new Blob([utf + str], {
      type: 'text/csv',
    });
    return URL.createObjectURL(csvData);
  }
  return `data:text/csv;charset=utf-8,${utf}${encodeURIComponent(str)}`;
}
