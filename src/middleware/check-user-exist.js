const UserServices = require('../services/user-services');
const { ErrorHandler } = require('../utils/error-handler');

// This middleware is used to validate user that is it exist or not by email
module.exports = async (req, res, next) => {
    const { email = '' } = req.body;
    let user = null;

    try {
        if (email) user = await UserServices.getUserByEmail(email);

        if (!user) return next(new ErrorHandler(401, 'User does not Exist. Please Register yourself'));

        req.user = user;
    } catch (err) {
        return next(new ErrorHandler(404));
    }

    return next();
};
