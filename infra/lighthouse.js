const execSync = require('child_process').execSync;

exports.getLighthouseScore = (url) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`${url}`);

      // Lighthouse CLIを実行
      const result = execSync(`lighthouse "${url}" --output json --quiet`, {timeout: 60000}).toString();
      const stats = JSON.parse(result);

      const scoreMap = Object.entries(stats.categories).reduce((acc, [key, val]) => {
        return Object.assign({}, acc, {[val.title]: val.score ? parseInt(val.score * 100) : 0 });
      }, {});

      resolve(scoreMap);
    } catch(e) {
      reject({});
      execSync
    } 
  });
}