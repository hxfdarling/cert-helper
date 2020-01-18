const path = require('path');
const { certVerify } = require('../lib');

console.log('install success');
certVerify({ certDir: path.join(__dirname, '../certs/root.crt'), certName: 'Bifrost' }, (err) => {
  if (err) {
    console.error('verify err', err);
  } else {
    console.log('certificate installed');
  }
});
