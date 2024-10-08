const { formatErrorString, printErrorLog } = require('./utils');

exports.wrapAsync = (func) => async (req, res, next) => {
    try {
        await func(req, res);
    } catch (error) {
        console.log(JSON.stringify(error));

        printErrorLog(`${req.originalUrl} catch: ` + formatErrorString(error));
        return next(error);
    }
};
