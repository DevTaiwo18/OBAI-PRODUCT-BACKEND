const { Joi, Segments } = require('celebrate');
const CONSTANT_ENUM = require('../helpers/constant-enums');

const createData = {
    [Segments.BODY]: Joi.object().keys({
        company: Joi.string().required('company is required'),
        claimNumber: Joi.string().required('claimNumber is required'),
        vehicle: Joi.object().keys({
            ownerName: Joi.string().required('ownerName is required'),
            ownerNumber: Joi.string().required('ownerNumber is required'),
            ownerAddressOne: Joi.string().required('ownerAddressOne is required'),
            ownerAddressTwo: Joi.string().required('ownerAddressTwo is required'),
            city: Joi.string().required('city is required'),
            state: Joi.string().required('state is required'),
            zip: Joi.string().required('zip is required'),
            locationName: Joi.string().required('locationName is required'),
            locationNumber: Joi.string().required('locationNumber is required'),
            locationAddressOne: Joi.string().required('locationAddressOne is required'),
            locationAddressTwo: Joi.string().required('locationAddressTwo is required'),
            locationCity: Joi.string().required('locationCity is required'),
            locationState: Joi.string().required('locationState is required'),
            locationZip: Joi.string().required('locationZip is required'),
            make: Joi.string().required('make is required'),
            model: Joi.string().required('model is required'),
            year: Joi.string().required('year is required'),
            color: Joi.string().required('color is required'),
            plateNumber: Joi.string().required('plateNumber is required'),
            vin: Joi.string().required('vin is required')
        })
    })
};

const getDataByID = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required('id is required')
    })
};

const updateData = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required('claim id required in url')
    }),
    [Segments.BODY]: Joi.object().keys({
        company: Joi.string().optional(),
        claimNumber: Joi.string().optional(),
        vehicle: Joi.object().keys({
            ownerName: Joi.string().optional(),
            ownerNumber: Joi.string().optional(),
            ownerAddressOne: Joi.string().optional(),
            ownerAddressTwo: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zip: Joi.string().optional(),
            locationName: Joi.string().optional(),
            locationNumber: Joi.string().optional(),
            locationAddressOne: Joi.string().optional(),
            locationAddressTwo: Joi.string().optional(),
            locationCity: Joi.string().optional(),
            locationState: Joi.string().optional(),
            locationZip: Joi.string().optional(),
            make: Joi.string().optional(),
            model: Joi.string().optional(),
            year: Joi.string().optional(),
            color: Joi.string().optional(),
            plateNumber: Joi.string().optional(),
            vin: Joi.string().optional()
        }),
        status: Joi.string().optional().valid(CONSTANT_ENUM.STATUS.PENDING, CONSTANT_ENUM.STATUS.ON_GOING, CONSTANT_ENUM.STATUS.APPROVE, CONSTANT_ENUM.STATUS.REJECT, CONSTANT_ENUM.STATUS.ARCHIVE)
    })
};

const submitClaim = {
    [Segments.BODY]: Joi.object().keys({
        claimID: Joi.string().required('Claim-ID is required'),
        dentList: Joi.array().items({
            title: Joi.string().required('title is required'),
            severityClass: Joi.string()
                .required('Severity Class is required')
                .valid(CONSTANT_ENUM.DENTS_CLASS.VERY_LIGHT, CONSTANT_ENUM.DENTS_CLASS.LIGHT, CONSTANT_ENUM.DENTS_CLASS.MODERATE, CONSTANT_ENUM.DENTS_CLASS.MEDIUM, CONSTANT_ENUM.DENTS_CLASS.HEAVY),
            size: Joi.string().required('Size is required').valid(CONSTANT_ENUM.DENTS_SIZE.DIME, CONSTANT_ENUM.DENTS_SIZE.NICKEL, CONSTANT_ENUM.DENTS_SIZE.QUARTER, CONSTANT_ENUM.DENTS_SIZE.HALF),
            price: Joi.number().required('Price is required'),
            images: Joi.array().items(Joi.string()).min(1).required('At-least provide one image')
        })
    })
};

const ClaimValidator = {
    createData,
    getDataByID,
    updateData,
    submitClaim
};

module.exports = ClaimValidator;
