const express = require('express');
const claimRouter = express.Router();
const { celebrate } = require('celebrate');
const ClaimValidator = require('../request-schemas/claim');
const ClaimController = require('../controllers/claim');
const checkAuth = require('../middleware/check-auth');

const API = {
    CREATE: '/',
    ARCHIVES: '/archives',
    SUBMIT: '/submit',
    ALL: '/all',
    UPDATE: '/:id',
    GET_PAGINATION: '/all',
    GET: '/',
    GET_BY_ID: '/:id',
    DELETE: '/:id'
};

claimRouter.post(API.CREATE, checkAuth, celebrate(ClaimValidator.createData), ClaimController.createData);

claimRouter.put(API.ARCHIVES, checkAuth, ClaimController.archiveClaims);

claimRouter.put(API.SUBMIT, ClaimController.submit);

claimRouter.put(API.ALL, ClaimController.updateAll);

claimRouter.put(API.UPDATE, checkAuth, celebrate(ClaimValidator.updateData), ClaimController.updateData);

claimRouter.get(API.GET_PAGINATION, checkAuth, ClaimController.getAllClaimsPagination);

claimRouter.get(API.GET, checkAuth, ClaimController.getData);

claimRouter.get(API.GET_BY_ID, celebrate(ClaimValidator.getDataByID), ClaimController.getData);

claimRouter.delete(API.DELETE, checkAuth, celebrate(ClaimValidator.getDataByID), ClaimController.deleteDataByID);

module.exports = claimRouter;
