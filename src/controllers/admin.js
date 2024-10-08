const config = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminServices = require('../services/admin');
const { ErrorHandler } = require('../utils/error-handler');
const { wrapAsync } = require('../utils/wrapAsync');
const { randomNumberGenerate } = require('../utils/utils');

const login = async (req, res) => {
    const { email, password } = req.body;

    const userExist = await AdminServices.getData({ email });

    if (!userExist) throw new ErrorHandler(400, 'User Not Exist. Please Register yourself');

    const isMatch = await bcrypt.compare(password, userExist?.password);

    if (!isMatch) throw new ErrorHandler(400, 'Incorrect password');

    const token = jwt.sign({ _id: userExist?._id }, config.server.jwtSecretKey, {
        expiresIn: '168h'
    });

    return res.status(200).json({
        data: {
            user: userExist,
            token
        },
        message: 'Logged in successfully'
    });
};

const createData = async (req, res) => {
    const payloadData = req.body;
    const { password } = payloadData;

    const userExist = await AdminServices.getData({ email: payloadData?.email });

    if (userExist?.email) throw new ErrorHandler(400, 'User Not Exist. Please Register yourself');

    const hashPassword = await bcrypt.hash(password, 10);

    const resp = await AdminServices.createData({ ...payloadData, password: hashPassword });

    return res.status(201).json({
        data: resp,
        message: 'Record saved successfully'
    });
};

const updateData = async (req, res) => {
    const { _id } = req.user;
    const payloadData = req.body;

    if (payloadData?.password) {
        payloadData.password = await bcrypt.hash(payloadData?.password, 10);
    }

    const resp = await AdminServices.updateData(_id, payloadData);

    return res.status(200).json({
        data: resp,
        message: 'Record update successfully'
    });
};

const getData = async (req, res) => {
    let resp = null;

    const filter = Object.keys(req.query).reduce((a, b) => {
        a[b] = req.query[b];
        return a;
    }, {});

    if (req.params?.id) resp = await AdminServices.getDataByID(req.params?.id, filter);
    else resp = await AdminServices.getAllData(filter);

    return res.status(200).json({
        data: resp,
        message: 'Record fetch successfully'
    });
};

const deleteDataByID = async (req, res) => {
    const { id } = req.params;

    const filter = Object.keys(req.query).reduce((a, b) => {
        a[b] = req.query[b];
        return a;
    }, {});

    const resp = await AdminServices.deleteDataByID(id, filter);

    return res.status(200).json({
        data: resp,
        message: 'Record delete successfully'
    });
};

const verifyEmailAndSendOtpOnEmail = async (req, res) => {
    const { email } = req.body;
    const otp = randomNumberGenerate(6);

    const userExist = await AdminServices.getData({ email });

    if (!userExist) throw new ErrorHandler(400, "Couldn't find your account with this email");

    const resp = await AdminServices.updateData(userExist?._id, {
        otp
    });

    // TODO: USE THIS LATER
    // MAIL_HANDLER.sendEmailToUserWithOTP(email, otp);

    return res.json({
        data: {
            userID: resp._id,
            otp
        },
        message: 'OTP sent successfully'
    });
};

const verifyOTP = async (req, res) => {
    const { userID, otp } = req.body;

    const userExist = await AdminServices.getData({ _id: userID, otp });

    if (!userExist) throw new ErrorHandler(300, 'Invalid OTP');

    userExist.otp = '';

    userExist.save();

    return res.json({ message: 'OTP verify successfully' });
};

const updatePassword = async (req, res) => {
    const payloadData = req.body;
    const { password, userID } = payloadData;

    const hashPassword = await bcrypt.hash(password, 10);

    const resp = await AdminServices.updateData(userID, {
        password: hashPassword,
        otp: ''
    });

    return res.status(201).json({
        data: resp,
        message: 'Password updated successfully'
    });
};

const AdminController = {
    login: wrapAsync(login),
    createData: wrapAsync(createData),
    updateData: wrapAsync(updateData),
    getData: wrapAsync(getData),
    deleteDataByID: wrapAsync(deleteDataByID),
    verifyEmailAndSendOtpOnEmail: wrapAsync(verifyEmailAndSendOtpOnEmail),
    verifyOTP: wrapAsync(verifyOTP),
    updatePassword: wrapAsync(updatePassword)
};

module.exports = AdminController;
