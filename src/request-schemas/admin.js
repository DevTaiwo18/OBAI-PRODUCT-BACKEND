const { Joi, Segments } = require('celebrate');

const createData = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        userName: Joi.string().optional()
    })
};

const getDataByID = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required('id is required')
    })
};

const adminLogin = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

const updateData = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().optional(),
        password: Joi.string().optional(),
        userName: Joi.string().optional(),
        isDelete: Joi.boolean().optional(),
        deleteDate: Joi.date().optional()
    })
};

const forgotPassword = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required()
    })
};

const verifyOTP = {
    [Segments.BODY]: Joi.object().keys({
        userID: Joi.string().required(),
        otp: Joi.string().required()
    })
};

const updatePassword = {
    [Segments.BODY]: Joi.object().keys({
        userID: Joi.string().required(),
        password: Joi.string().min(8).required().label('Password'),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Password not match')
    })
};

const AdminValidator = {
    createData,
    getDataByID,
    adminLogin,
    updateData,
    forgotPassword,
    verifyOTP,
    updatePassword
};

module.exports = AdminValidator;
