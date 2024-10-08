const mongoose = require('mongoose');
const CONSTANT_ENUM = require('../helpers/constant-enums');

const dentInfoSchema = new mongoose.Schema(
    {
        title: String,
        dentType: {
            type: String,
            enum: [
                CONSTANT_ENUM.DENTS_CLASS.VERY_LIGHT,
                CONSTANT_ENUM.DENTS_CLASS.LIGHT,
                CONSTANT_ENUM.DENTS_CLASS.MODERATE,
                CONSTANT_ENUM.DENTS_CLASS.MEDIUM,
                CONSTANT_ENUM.DENTS_CLASS.HEAVY,
                CONSTANT_ENUM.DENTS_CLASS.NULL
            ]
        },
        dentSize: {
            type: String,
            enum: [CONSTANT_ENUM.DENTS_SIZE.DIME, CONSTANT_ENUM.DENTS_SIZE.NICKEL, CONSTANT_ENUM.DENTS_SIZE.QUARTER, CONSTANT_ENUM.DENTS_SIZE.HALF, CONSTANT_ENUM.DENTS_SIZE.NULL]
        },
        price: String,
        step: Number,
        vinNumber: String,
        odoMeterNumber: String,
        isCheckQuality: Boolean,
        miles: String,
        images: {
            type: [{ type: String }],
            default: []
        },
        dashboardVinImages: [{ type: String }],
        doorJamVinImages: [{ type: String }]
    },
    {
        timestamps: true
    }
);

const vehicleSchema = new mongoose.Schema(
    {
        ownerName: String,
        ownerNumber: String,
        ownerAddressOne: String,
        ownerAddressTwo: String,
        city: String,
        state: String,
        zip: String,
        locationName: String,
        locationNumber: String,
        locationAddressOne: String,
        locationAddressTwo: String,
        locationCity: String,
        locationState: String,
        locationZip: String,
        make: String,
        model: String,
        year: String,
        color: String,
        plateNumber: String,
        vin: String
    },
    { timestamps: true }
);

const claimSchema = new mongoose.Schema(
    {
        company: String,
        claimNumber: String,
        vehicle: vehicleSchema,
        status: {
            type: String,
            enum: [CONSTANT_ENUM.STATUS.PENDING, CONSTANT_ENUM.STATUS.ON_GOING, CONSTANT_ENUM.STATUS.ARCHIVE],
            default: CONSTANT_ENUM.STATUS.PENDING
        },
        dentInfo: [dentInfoSchema],
        isArchive: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deleteDate: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const ClaimSchemaDB = mongoose.model('claim', claimSchema);
module.exports = ClaimSchemaDB;
