const path = require('path');
const { certInstaller } = require('../lib');

certInstaller(path.join(__dirname, '../certs/root.crt'), (err) => {
  if (err) {
    console.error('install fatal', err);
  } else {
    console.log('install success');
  }
});
