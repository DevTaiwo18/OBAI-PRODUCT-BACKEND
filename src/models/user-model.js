const mongoose = require('mongoose');
const CONSTANT_ENUM = require('../helpers/constant-enums');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
            unique: true
        },
        platform: {
            type: String,
            enum: [CONSTANT_ENUM.PLATFORMS.FACEBOOK, CONSTANT_ENUM.PLATFORMS.GMAIL, CONSTANT_ENUM.PLATFORMS.APPLE, CONSTANT_ENUM.PLATFORMS.EMAIL, CONSTANT_ENUM.PLATFORMS.PHONE]
        },
        gender: {
            type: String,
            enum: [CONSTANT_ENUM.GENDER.MALE, CONSTANT_ENUM.GENDER.FEMALE]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: function () {
                return this.platform === CONSTANT_ENUM.PLATFORMS.EMAIL;
            }
        },
        facebookID: {
            type: String,
            required: function () {
                return this.platform === CONSTANT_ENUM.PLATFORMS.FACEBOOK;
            }
        },
        gmailID: {
            type: String,
            required: function () {
                return this.platform === CONSTANT_ENUM.PLATFORMS.GMAIL;
            }
        },
        appleID: {
            type: String,
            required: function () {
                return this.platform === CONSTANT_ENUM.PLATFORMS.APPLE;
            }
        },
        lastVisit: {
            type: Date,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const UserSchemaDB = mongoose.model('users', userSchema);
module.exports = UserSchemaDB;
