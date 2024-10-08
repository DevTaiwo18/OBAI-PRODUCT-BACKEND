const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true
        },
        email: String,
        otp: String,
        password: String,
        isDelete: {
            type: Boolean,
            default: false
        },
        deleteDate: {
            type: Date,
            default: null
        },
        lastVisit: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const AdminSchemaDB = mongoose.model('admin', adminSchema);
module.exports = AdminSchemaDB;
