const _ = require('lodash');

const spreadsheet = require('./infra/spreadsheet');
const lighthouse = require('./infra/lighthouse');
const slack = require('./infra/slack');

const checkLighthouse = async() => {
  const urls = await spreadsheet.getReleasePath();
  if (urls.length === 0) {
    console.log('No URL...');
    return;
  }

  // 重複URLは削除
  _.uniq(urls);

  for(const url of urls) {
    let message = '';
    message += `${url} のLighthouseスコア\n`;

    try {
      const score = await lighthouse.getLighthouseScore(url);

      console.log(score);
      if(score.length !== 0) {
        for (var key in score) {
          if(score[key] < 30) {
            message += `\t${key}: *${score[key]}*:fire:\n`;
          } else {
            message += `\t${key}: ${score[key]}\n`;
          }
        }
      } else {
        console.log('No Score...');
        message += `\tスコアの測定ができませんでした。`;
      }
    } catch(e) {
      console.log('Lighthouse Error...');
      message += `\tスコアの測定ができませんでした。`;
    } finally {
      const params = {
        message
      };
      slack.send(params);
    }
  }

  return;
};

(() => {
  checkLighthouse();
})();