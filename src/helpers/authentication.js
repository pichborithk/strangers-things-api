const crypto = require('crypto');
require('dotenv').config();

const SECRET = process.env.SECRET || 'SECRET';

function random() {
  return crypto.randomBytes(128).toString('base64');
}

function authentication(salt, password) {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex');
}

module.exports = { random, authentication };
