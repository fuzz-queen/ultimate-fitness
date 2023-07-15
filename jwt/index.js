const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Jim used to have a thing for Pam';

const encode = (data) => {
    return jwt.sign(data, JWT_SECRET);
}

const decode = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {encode, decode}