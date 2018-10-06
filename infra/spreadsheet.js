const { promisify } = require('util');
const moment = require('moment');
const GoogleSpreadsheet = require('google-spreadsheet');

const config = require('../config/config');
const credentials = require('../config/client.json');

const mySheet = new GoogleSpreadsheet(config.spreadsheets.release);

// URLが記載されているカラム
const COL_URL = 7;

exports.getReleasePath = async() => {
  const urls = [];

  // スプレッドシートからデータ取得
  await promisify(mySheet.useServiceAccountAuth)(credentials);
  const data = await promisify(mySheet.getInfo)();

  const option = {
    'min-row': 9,
    'max-row': 25,
    'return-empty': false,
  };

  // スプレッドシートデータの中からURL情報を抽出
  for(const worksheet of data.worksheets) {
    const today = moment().format('MM/DD');
    if(worksheet.title === `${today}`) {
      const cells = await promisify(worksheet.getCells)(option);

      for(const cell of cells) {
        if(cell.col === COL_URL && cell.value !== 'なし' && cell.value) {
          urls.push(`${config.spreadsheets.host.pc}${cell.value}`);
        }
      }
    }
  }

  return urls;
};