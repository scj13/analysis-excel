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
