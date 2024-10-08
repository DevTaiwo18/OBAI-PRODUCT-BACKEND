const { ErrorHandler } = require('../utils/error-handler');
const { formatErrorString, printErrorLog, trimAllFieldsInObjectAndChildren, getCurrentTimeStamp } = require('../utils/utils');
const { auditPersonJson } = require('../models/log-model');
const { format } = require('date-fns');
const now = require('performance-now');

// This middleware stores incoming request audit details, so that we can log it via bunyan library & can later use these logs for benchmarking or debugging
module.exports = (req, res, next) => {
    try {
        let reqData = '';
        reqData = req.body;

        res.locals.jsonReq = trimAllFieldsInObjectAndChildren(reqData); // Storing incoming request object
        res.locals.requestId = now(); // Assigning unique key to trace this request cycle later in logs
        res.locals.auditPDetail = auditPersonJson(req, res.locals.requestId); // Storing user's info
        res.locals.startTime = format(new Date(), 'HH:mm:ss.SSS'); // For benchmarking purpose
        res.locals.startTimeStamp = now();
        res.locals.currentTimeStamp = getCurrentTimeStamp(); // Get the current timestamp
        return next();
    } catch (error) {
        printErrorLog('Exception: ' + formatErrorString(error));
        return next(new ErrorHandler(300));
    }
};
