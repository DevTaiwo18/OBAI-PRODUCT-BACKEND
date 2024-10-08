const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/error-handler');
const isValidObjectId = mongoose.isValidObjectId;

const checkObjectId = (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(404);
        next(ErrorHandler(404, `Invalid ObjectId of:  ${req.params.id}`));
    }
    next();
};

module.exports = checkObjectId;
