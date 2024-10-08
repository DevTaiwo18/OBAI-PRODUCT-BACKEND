const express = require('express');
const userRouter = express.Router();
const audit = require('../middleware/audit');
const { celebrate } = require('celebrate');
const UserController = require('../controllers/user-controllers');
const UserValidator = require('../request-schemas/user-schema.js');
const checkUserExist = require('../middleware/check-user-exist');
const checkAuth = require('../middleware/check-auth.js');
const authorizedRoles = require('../middleware/authorized-roles.js');
const CONSTANT_ENUM = require('../helpers/constant-enums.js');
const checkObjectId = require('../helpers/check-object-id');
const checkResourceExists = require('../middleware/check-resource-exists.js');

const API = {
    REGISTER_EMAIL_USER: '/register/email',
    GET_ALL_USERS: '/',
    VISION: '/vision/api',
    GET_USER: '/:id',
    SEND_OTP_ON_EMAIL: '/send/otp/email',
    UPDATE_EMAIL_PASSWORD: '/update/password',
    LOGIN_EMAIL: '/login/email',
    UPDATE_USER: '/user/edit/:id',
    UPDATE_PROFILE: '/profile',
    DELETE_ACCOUNT: '/delete-account',
    DELETE_USER: '/delete/:id',
    DROP_COLLECTION: '/drop',
    DECODE_TOKEN: '/token'
};

userRouter.post(API.REGISTER_EMAIL_USER, audit, celebrate(UserValidator.registerUserByEmail), UserController.registerUserByEmail);

userRouter.get(API.DECODE_TOKEN, UserController.getUserFromToken);

userRouter.get(API.GET_ALL_USERS, audit, UserController.getAllUsers);

userRouter.get(API.GET_USER, audit, celebrate(UserValidator.getUser), checkObjectId, UserController.getUser);

userRouter.put(API.SEND_OTP_ON_EMAIL, audit, celebrate(UserValidator.registerUserByEmail), checkUserExist, UserController.sendOtpOnEmail);

userRouter.put(API.UPDATE_EMAIL_PASSWORD, audit, celebrate(UserValidator.updateEmailPassword), checkUserExist, UserController.updateEmailPassword);

userRouter.post(API.LOGIN_EMAIL, audit, celebrate(UserValidator.loginWithEmail), checkUserExist, UserController.loginWithEmail);

userRouter.put(
    API.UPDATE_USER,
    audit,
    celebrate(UserValidator.updateUser),
    checkObjectId,
    checkResourceExists('users'),
    checkAuth,
    authorizedRoles([CONSTANT_ENUM.USER_ROLE.ADMIN, CONSTANT_ENUM.USER_ROLE.SUPER_ADMIN]),
    UserController.updateProfile
);

userRouter.put(API.UPDATE_PROFILE, audit, celebrate(UserValidator.updateProfile), checkAuth, UserController.updateProfile);

userRouter.put(API.DELETE_ACCOUNT, audit, celebrate(UserValidator.deleteAccount), checkAuth, UserController.deleteMyAccount);

userRouter.put(
    API.DELETE_USER,
    audit,
    celebrate(UserValidator.deleteUser),
    checkObjectId,
    checkAuth,
    authorizedRoles([CONSTANT_ENUM.USER_ROLE.ADMIN, CONSTANT_ENUM.USER_ROLE.SUPER_ADMIN]),
    UserController.deleteUser
);

userRouter.get(API.DROP_COLLECTION, audit, UserController.dropUserCollection);

userRouter.post(API.VISION, audit, UserController.visionApi);

module.exports = userRouter;
