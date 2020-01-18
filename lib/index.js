/* eslint-disable no-param-reassign */
const path = require('path');
const fs = require('fs');
const mac = require('./mac');
const windows = require('./windows');

/**
 *
 * @param {string} cert certificate file path
 * @param {Function} callback
 */
function install(cert, callback) {
  if (typeof cert !== 'string') {
    throw new Error('certificate file path must a string');
  }
  cert = path.resolve(cert);
  if (!fs.existsSync(cert)) {
    throw new Error(`${cert} file not found`);
  }

  const { platform } = process;

  if (platform === 'darwin') return mac.certInstaller(cert, callback);
  if (platform === 'win32') return windows.certInstaller(cert, callback);

  throw new Error(`Platform ${platform} is not supported.`);
}

/**
 * @typedef {Object} CertOptions
 * @property {string} certDir - certificate file path
 * @property {string} certName - certificate name
 */

/**
 *
 * @param {CertOptions} cert
 * @param {Function} callback
 */
function verify(cert, callback) {
  const { certDir, certName } = cert;
  if (typeof certDir !== 'string') {
    throw new Error('cert.certDir path must a string');
  }
  if (typeof certName !== 'string') {
    throw new Error('cert.certName must a string');
  }
  cert.certDir = path.resolve(cert.certDir);

  if (!fs.existsSync(cert.certDir)) {
    throw new Error(`${cert.certDir} file not found`);
  }

  const { platform } = process;

  if (platform === 'darwin') return mac.certVerify(cert, callback);
  if (platform === 'win32') return windows.certVerify(cert, callback);

  throw new Error(`Platform ${platform} is not supported.`);
}

module.exports = {
  certInstaller: install,
  certVerify: verify,
};
