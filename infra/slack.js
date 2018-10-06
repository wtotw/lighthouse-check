const config = require('../config/config').slack;

exports.send = (params) => {
  const https = require('https');

  const channel = config.cannel;
  const text = params.message;
  const method = 'post';
  const username   = 'Lighthouse通知';

  // 絵文字か画像URLのどちらか
  const icon = 'https://raw.githubusercontent.com/GoogleChrome/lighthouse/master/assets/lh_logo_icon.png';

  const payload = {
    "channel": channel,
    "username": username,
    "text": text,
    "icon_url": icon,
  };

  const data = JSON.stringify(payload);

  const options = {
    hostname: config.host,
    port: 443,
    path: config.path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    console.log('status code : ' + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (d) => {
      console.log(d)
    });
  });

  req.on('error', (e) => {
    console.error(e)
  ;});

  req.write(data);
  req.end();
}