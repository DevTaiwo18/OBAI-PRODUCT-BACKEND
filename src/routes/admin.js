const express = require('express');
const adminRouter = express.Router();
const { celebrate } = require('celebrate');
const AdminValidator = require('../request-schemas/admin');
const AdminController = require('../controllers/admin');
const checkAuth = require('../middleware/check-auth');

const API = {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot',
    VERIFY_OTP: '/otp/verify',
    CREATE: '/',
    UPDATE: '/',
    GET: '/',
    GET_BY_ID: '/:id',
    DELETE: '/:id',
    UPDATE_PASSWORD: '/update/password'
};

adminRouter.post(API.LOGIN, celebrate(AdminValidator.adminLogin), AdminController.login);

adminRouter.post(API.CREATE, celebrate(AdminValidator.createData), AdminController.createData);

adminRouter.put(API.UPDATE, celebrate(AdminValidator.updateData), checkAuth, AdminController.updateData);

adminRouter.get(API.GET, checkAuth, AdminController.getData);

adminRouter.get(API.GET_BY_ID, celebrate(AdminValidator.getDataByID), checkAuth, AdminController.getData);

adminRouter.delete(API.DELETE, celebrate(AdminValidator.getDataByID), checkAuth, AdminController.deleteDataByID);

adminRouter.post(API.FORGOT_PASSWORD, celebrate(AdminValidator.forgotPassword), AdminController.verifyEmailAndSendOtpOnEmail);

adminRouter.post(API.VERIFY_OTP, celebrate(AdminValidator.verifyOTP), AdminController.verifyOTP);

adminRouter.post(API.UPDATE_PASSWORD, celebrate(AdminValidator.updatePassword), AdminController.updatePassword);

module.exports = adminRouter;
