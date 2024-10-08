const { Joi, Segments } = require('celebrate');
const CONSTANT_ENUM = require('../helpers/constant-enums');

const registerUserByEmail = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string()
            .min(8)
            .pattern(/(?=.*[A-Z])/) // Regex literal for at least one uppercase letter
            .pattern(/(?=.*[0-9])/) // Regex literal for at least one number
            .pattern(/(?=.*[!@#$%^&*])/) // Regex literal for at least one special character
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one number, and one special character',
                'any.required': 'Password is required'
            }),
        gender: Joi.string().valid(CONSTANT_ENUM.GENDER.MALE, CONSTANT_ENUM.GENDER.FEMALE).required().messages({
            'any.only': 'Gender must be male, female, or other',
            'any.required': 'Gender is required'
        })
    })
};

const validOTP = {
    [Segments.BODY]: Joi.object().keys({
        otp: Joi.string().required('OTP required')
    })
};

const verifiedOTP = {
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required('Email required'),
        otp: Joi.string().required('OTP required')
    })
};

const updateEmailPassword = {
    [Segments.BODY]: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required().label('Password'),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm Password')
        })
        .options({
            messages: {
                'any.only': 'Passwords do not match with confirmPassword'
            }
        })
};

const getAllUsers = {
    [Segments.HEADERS]: Joi.object()
        .keys({
            Authorization: Joi.string().required()
        })
        .unknown()
};

const verified = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
};

const loginWithEmail = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

const createProfile = {
    [Segments.BODY]: Joi.object().keys({
        userName: Joi.string().max(15).alphanum().required().label('String'),
        gender: Joi.string().required().valid(CONSTANT_ENUM.GENDER.MALE, CONSTANT_ENUM.GENDER.FEMALE)
    })
};

const deleteUser = {
    [Segments.HEADERS]: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
};

const deleteAccount = {
    [Segments.HEADERS]: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
};

const updateProfile = {
    [Segments.HEADERS]: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        userName: Joi.string().max(15).alphanum().required().label('String'),
        gender: Joi.string().required().valid(CONSTANT_ENUM.GENDER.MALE, CONSTANT_ENUM.GENDER.FEMALE)
    })
};

const updateUser = {
    [Segments.HEADERS]: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        userName: Joi.string().max(15).alphanum().required().label('String'),
        gender: Joi.string().required().valid(CONSTANT_ENUM.GENDER.MALE, CONSTANT_ENUM.GENDER.FEMALE)
    })
};

const getUser = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
};

const UserValidator = {
    registerUserByEmail,
    updateProfile,
    updateUser,
    validOTP,
    deleteUser,
    deleteAccount,
    getAllUsers,
    verified,
    verifiedOTP,
    loginWithEmail,
    updateEmailPassword,
    createProfile,
    getUser
};

module.exports = UserValidator;
