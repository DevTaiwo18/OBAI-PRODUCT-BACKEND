const config = require('../config/config');
const { ErrorHandler } = require('../utils/error-handler');
const { isEmpty } = require('../utils/utils');
const jwt = require('jsonwebtoken');
const AdminServices = require('../services/admin');

// Middleware to validate user existence by email and JWT
module.exports = async (req, res, next) => {
    try {
        // Validate the JWT
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];

        if (isEmpty(token)) {
            return next(new ErrorHandler(403, 'Token is missing'));
        }

        try {
            const decoded = jwt.verify(token, config.server.jwtSecretKey); // Verify JWT using the private key
            const userExist = await AdminServices.getDataByID(decoded._id);
            if (!userExist) {
                return next(new ErrorHandler(404, "Couldn't find your account, please create an account"));
            }

            if (userExist.isDelete) return next(new Error('Your account is deleted. Register new account'));

            req.user = userExist; // Saving userInfo info like email for later use
        } catch (err) {
            return next(new ErrorHandler(401, "Couldn't verify your identity, please try logging in again"));
        }
        next();
    } catch (err) {
        return next(new ErrorHandler(404, 'User account not found'));
    }
};
