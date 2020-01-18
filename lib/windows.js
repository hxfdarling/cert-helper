const { spawn } = require('child_process');

function install(cert, callback) {
  const store = 'Root';
  const spawnInstall = spawn('certutil', ['-addstore', '-user', store, cert]);
  let errOutput;
  spawnInstall.on('error', (err) => callback(err));
  spawnInstall.stdout.on('data', (data) => {
    console.log('win install cert', data.toString());
  });
  spawnInstall.stderr.on('data', (data) => {
    errOutput = data;
  });
  spawnInstall.on('close', (code) => {
    console.log('win install cert code', code);
    if (code !== 0) return callback(new Error(errOutput));
    return callback(null);
  });
}

function verify({ certName }, callback) {
  const store = 'Root';
  const certutil = spawn('certutil', ['-store', '-user', store]);
  const findstr = spawn('findstr', [certName]);
  let errOutput = '';

  certutil.on('error', (err) => callback(err));

  certutil.stdout.on('data', (data) => {
    findstr.stdin.write(data);
  });

  certutil.stderr.on('data', (data) => {
    errOutput += data;
    console.log(`certutil stderr: ${data}`);
  });

  certutil.on('close', (code) => {
    if (code !== 0) {
      console.log(`certutil process exited with code ${code}`);
    }
    findstr.stdin.end();
  });

  findstr.on('error', (err) => callback(err));

  findstr.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  findstr.stderr.on('data', (data) => {
    errOutput += data;
    console.log(`findstr stderr: ${data}`);
  });

  findstr.on('close', (code) => {
    if (code !== 0) {
      console.log(`findstr process exited with code ${code}`);
      return callback(new Error(errOutput));
    }
    return callback(null);
  });
}

module.exports = {
  certInstaller: install,
  certVerify: verify,
};
