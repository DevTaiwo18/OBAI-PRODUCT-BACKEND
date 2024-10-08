const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id, role, expiresIn) => {
    return jwt.sign({ id, role }, config.server.jwtSecretKey, {
        expiresIn
    });
};

module.exports = generateToken;
