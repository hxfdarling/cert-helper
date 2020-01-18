const { spawn } = require('child_process');

function macVerify({ certDir }, callback) {
  const spawnVerify = spawn('security', ['verify-cert', '-c', certDir]);
  let errOutput;
  spawnVerify.on('error', (err) => callback(err));
  spawnVerify.stdout.on('data', (data) => {
    console.log('mac check cert', data.toString());
  });
  spawnVerify.stderr.on('data', (data) => {
    errOutput = data;
  });
  spawnVerify.on('close', (code) => {
    console.log('mac check cert code', code);
    if (code !== 0) return callback(new Error(errOutput));
    return callback(null);
  });
}

function getDefaultKeychain(callback) {
  const spawnGetKeychain = spawn('security', ['default-keychain']);
  let errOutput;
  let keychain;
  spawnGetKeychain.on('error', (err) => callback(err));
  spawnGetKeychain.stdout.on('data', (data) => {
    console.log('mac get keychain', data.toString());
    // eslint-disable-next-line prefer-destructuring
    keychain = data.toString().split('"')[1];
  });
  spawnGetKeychain.stderr.on('data', (data) => {
    errOutput = data;
  });
  spawnGetKeychain.on('close', (code) => {
    console.log('mac get keychain code', code);
    if (code !== 0) return callback(new Error(errOutput));
    return callback(null, keychain);
  });
}

function trustCert(keychain, cert, callback) {
  const spawnTrust = spawn('security', ['add-trusted-cert', '-k', keychain, cert]);
  let errOutput;
  spawnTrust.on('error', (err) => callback(err));
  spawnTrust.stdout.on('data', (data) => {
    console.log('mac install cert', data.toString());
  });
  spawnTrust.stderr.on('data', (data) => {
    errOutput = data;
  });
  spawnTrust.on('close', (code) => {
    console.log('mac install cert code', code);
    if (code !== 0) return callback(new Error(errOutput));
    return callback(null);
  });
}

function verify(cert, callback) {
  return macVerify(cert, callback);
}

function install(cert, callback) {
  getDefaultKeychain((err, keychain) => {
    if (err) return callback(err);

    return trustCert(keychain, cert, callback);
  });
}

module.exports = {
  certInstaller: install,
  certVerify: verify,
};
