const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // this OTP will automatically expire after 5 minutes
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
