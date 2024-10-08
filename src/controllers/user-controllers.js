const config = require('../config/config');
const CONSTANT_ENUM = require('../helpers/constant-enums');
const MAIL_HANDLER = require('../mails/mails');
const OTP = require('../models/otp-model');
const UserServices = require('../services/user-services');
const { ErrorHandler } = require('../utils/error-handler');
const { randomNumberGenerate } = require('../utils/utils');
const { wrapAsync } = require('../utils/wrapAsync');
const jwt = require('jsonwebtoken');
const generateToken = require('../helpers/generate-token');
const { VertexAI } = require('@google-cloud/vertexai');

const loginWithEmail = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { password } = rq;
    const { user } = req;

    const isMatch = await user.matchPassword(password);

    if (!isMatch) throw new ErrorHandler(400, 'Incorrect email or password');

    const token = generateToken(user?._id, user?.role, '72h');

    return res.status(200).json({
        data: {
            user,
            token
        },
        message: 'User logged in successfully'
    });
};

const registerUserByEmail = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { email, password, gender } = rq;
    const otp = randomNumberGenerate(5);
    let message = '';
    let user = null;

    const userExist = await UserServices.getUserByEmail(email);

    if (userExist && userExist.isVerified) {
        message = 'User already exists';
        user = userExist;
    } else {
        if (!userExist) {
            user = await UserServices.createUser({
                email,
                password,
                gender,
                platform: CONSTANT_ENUM.PLATFORMS.EMAIL,
                lastVisit: new Date()
            });
        }

        // Create OTP document
        await OTP.create({ otp, user: userExist ? userExist._id : user._id });

        MAIL_HANDLER.sendEmailToUserWithOTP(email, otp);
        message = 'OTP sent on email';
    }

    return res.json({
        data: userExist || user,
        message
    });
};

const sendOtpOnEmail = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { email } = rq;
    const otp = randomNumberGenerate(5);

    const user = await UserServices.getUserByEmail(email);

    // Create OTP document
    await OTP.create({ otp, user: user._id });

    MAIL_HANDLER.sendEmailToUserWithOTP(email, otp);

    return res.json({
        data: {
            id: user._id,
            otp
        },
        message: 'OTP sent on email'
    });
};

const verifyOTP = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { id, otp } = rq;
    let message = '';
    let token = null;
    let user = null;

    const otpValid = await OTP.findOne({ user: id, otp });
    if (otpValid) {
        user = await UserServices.updateUserByID(id, {
            isVerified: true
        });

        token = generateToken(user?._id, user?.role, '72h');

        await OTP.deleteOne({ _id: otpValid._id });
        message = 'User account verified successfully';
    } else {
        throw new ErrorHandler(401, 'OTP could not verified, please try again');
    }

    return res.json({ message, user, token });
};

const updateEmailPassword = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { password } = rq;
    const { user } = req;

    let updatedUser = null;

    if (updatedUser) {
        updatedUser = await UserServices.updateUserByID(user._id, {
            password
        });
    } else {
        throw new ErrorHandler(404, 'User does not exist');
    }

    return res.json({
        data: updatedUser,
        message: 'Password updated successfully'
    });
};

const updateProfile = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { _id, ...rest } = rq;

    const id = req.user._id;

    const userExist = await UserServices.getUserByID(id);

    if (!userExist) throw new ErrorHandler(404, 'User does not exist');

    const user = await UserServices.updateUserByID(id, rest);

    return res.json({
        data: user,
        message: 'User profile updated successfully'
    });
};

const getProfile = async (req, res) => {
    // Using the user ID from req.user
    const id = req.user._id;

    const user = await UserServices.getUserByID(id);

    return res.json({
        data: user,
        message: 'User found successfully'
    });
};

const deleteMyAccount = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { status } = rq;

    // Using the user ID from req.user
    const id = req.user._id;

    const user = await UserServices.updateUserByID(id, {
        isDeleted: status,
        deleteDate: new Date()
    });

    return res.status(200).json({
        data: user,
        message: 'Your account has been deleted successfully'
    });
};

// Admin Routes
const getAllUsers = async (req, res) => {
    const resp = await UserServices.getAllUsers();

    return res.json({
        data: resp,
        message: 'Users found successfully'
    });
};

const getUser = async (req, res) => {
    const { id } = req.params;
    const resp = await UserServices.getUserByID(id);

    return res.json({
        data: resp,
        message: 'User found successfully'
    });
};

const deleteUser = async (req, res) => {
    const rq = res.locals.jsonReq;
    const { status } = rq;
    const { id } = req.params;

    const user = await UserServices.updateUserByID(id, {
        isDeleted: status,
        deleteDate: new Date()
    });

    return res.status(200).json({ data: user, message: 'User account deleted successfully' });
};

const dropUserCollection = async (req, res) => {
    const resp = await UserServices.dropUserCollection();

    return res.status(200).json({
        data: resp,
        message: 'Collection dropped successfully'
    });
};

const getUserFromToken = async (req, res) => {
    const { token } = req.body;
    const newData = { lastVisit: new Date() };

    if (!token) throw new ErrorHandler(404, 'Token not found');

    const decode = jwt.verify(token, config.server.jwtSecretKey);

    let user = await UserServices.getUserByID(decode._id);

    if (!user) throw new ErrorHandler(404, 'User not found');

    user = await UserServices.updateUserByID(user._id, newData);

    return res.status(200).json({
        data: user,
        message: 'Token Verified'
    });
};

const visionApi = async (req, res) => {
    const { imageBase64 } = req.body;

    const authOptions = {
        credentials: {
            client_email: 'oba-ai-account-396@obaai-420907.iam.gserviceaccount.com',
            private_key:
                '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDfsYqS+NjP1die\n4cYhiPLHIOvcchUfjIDJtiyvUEauIChbyTC7DVJjrs9mWMkDXwszJwy0WhWQBBQY\nKfr57ZrPBhRH9hn1AwVcmRnbJj0yW34J1ag2aliseszhLufFB7UON9pTnnkTlc1T\neIkXYKd2C7PuF47dgQQcJC+TBq3KxrtwhdOJVaNlkvAH9tKpxETVdnUpmMzu+Jq5\nTOE6vn8cB0GZNBbBAqJUN9JrTbck8/d9Ii0ULzSgk29xy308taZW/beasAeKDyp+\nPO52h1Id54nuy1bgeSTg0Fh4zhVd1tPRNMaFOxiK7bMcBBIzSz/BpzhljERgAoOG\nURGH+LjNAgMBAAECgf9wqAvGr/qBQ7GeCaj18YKcoi65VwRMXz+hxHkqZAyiW/1l\nF9vOWIvKXwjLlOteR0i4HuA0z7vnuZPS4L9OaLcOjDgYTut6i9QVKeFbtB1Cdhqo\na5anPsNFPtxdsMG/1H1IdP0kH73aeqmSTetPWrmOFVa/pGbPAs9qgWErKrHuWn+1\nWEE4FMCDTfVVKPmT83L2dkrQKQzkrl+A2anCyhyAo672+ZWpS6jGxu72LC/6HPbO\n37VJfcy/2pZ2Pyt3YaqyUsw3lxsweQN9YfvRpP/5YrbUzkFGKcw1bD5sYlkx+yRy\nAeY0GwmPjDVqjactfG19/tP3Q84D1doAyUxul8ECgYEA+4iu7J3hOJvdrzlOGO07\nuJS+ZfFGEzp0jE9/EimNxRum6U1p69OkFN1PtDQvXNo3+uVGIyyk1knszsuSzd7O\nvO+AWGJBzFoznOy+DzPLYoOGe9nC5PAmwam0gGLdl7cMvyH2wx/4zSwhpuhBy7I/\nfRN8TQDbWYmDdBrcfz6l2OECgYEA46pQGLdyNJCUsJRGQNoJ+8JidMo3e1YGJrmi\npW6/zSLErHoi/vk8umxBDZKrvkR25Daae1THClLM0amHR7FWRCk/HuRD5EIje30i\n4NiIq5LOUHPga4o52cEYZIRz/kYeFPj6q3f4faw1UQ9/eoWXiSQt+KkCf6CbaD3L\n5/FSgW0CgYEAmqtavN78Pd4CPBwlvMgr//1e8rqhF3PLdPfxME7jAUBWq4FRz5SN\ngdLwjuPD9/mrkJjpPvnVxnsgpayicfs+7wjqx+5rfWg98pHU8O4tcz9jM8ccw8A0\nZMOg3Y1tqzwBF4qf/S4sxKUNcF/DDalmxtdziLotJ2qarYtS6N+yBaECgYEAsn8a\n03Yo5Yuh+JwYRMpu32P1e6n8PAgjRINxQRGG8dfbqXsNKynQcj1j97dSThgxuxYQ\norfCYpaunYe0WAJzJ3fLVHYVwMYWOcDP8sfyx8qPVca0Yrx6RP8/F7g9lVP2S+01\n4/Bo9GdrWgWzpiVNvSmPnZEtM1GB5wXkdBLh5DUCgYEA3T/LRBF+5Ab+faG7fJ3p\nzNFJccR5L2eKzU6HPhGpWbIUBOXVw7yX6rkjD2hJZ2RQcJr1BrPFA6q/JQpN46do\nX8UkGrw/tRfYvalgiCFYP8QYDuwAWG1YRUTou5QPJ1dt8hjfwWzwBSqzQwMgUCHQ\nLByX68si1ak6C6jtu6s+Zf8=\n-----END PRIVATE KEY-----\n'
        }
    };

    // const authInfo = {
    //     project: 'obaai-420907',
    //     location: 'us-central1',
    //     googleAuthOptions: authOptions
    // };

    const vertexAi = new VertexAI({
        project: 'obaai-420907',
        location: 'us-central1',
        googleAuthOptions: authOptions
    });

    console.log('============ Step-2 ==========');

    // const vertexAi = new VertexAI({ project: 'obaai-420907', location: 'us-central1' });

    console.log('============ Step-2 ==========');

    const model = 'gemini-1.5-pro-preview-0409';

    // Instantiate the models
    const generativeModel = vertexAi.preview.getGenerativeModel({
        model,
        generationConfig: {
            maxOutputTokens: 8192,
            temperature: 1,
            topP: 0.95
        },
        safetySettings: [
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
        ]
    });

    console.log('============ Step-3 ==========');

    const image = {
        inlineData: {
            mimeType: 'image/png',
            data: imageBase64
        }
    };

    const prompt = {
        text: `You are a car mechanic. Have enough knowledge about car dents, and car parts. You have to analyze the image in following steps.
        1- Is it a car or not?
        2- Check if there is any dent in the car or not.
        3- Select the numberOfDents from the provided options: 1 to 5, 6 to 15, 16 to 30, 31 to 50, 51 to 75, More then 76, No dent.
        4- Select the dentSize from the provided options: Dime, Nickel, Quarter, Half-Dollar, It’s really bad, Null.
        Do not include any explanations. Only provide a RFC8259 compliant json response following this format without deviation.
        Provide the output in this format this object only const {isCar, isDamage, numberOfDents, dentSize}`
    };

    console.log('============ Step-4 ==========');

    const chat = generativeModel.startChat({});

    console.log('============ Step-5 ==========');

    const streamResult = await chat.sendMessageStream([prompt, image]);

    console.log('============ Step-6 ==========');

    // const resp = (await streamResult.response).candidates[0].content.parts[0].text;

    console.log('============ Step-7 ==========');

    // const resp = JSON.stringify((await streamResult.response).candidates[0].content.parts[0].text);

    // const result = resp.replaceAll(' ', '').replaceAll('"```json\\n', '').replaceAll('\\n```\\n"', '').replaceAll('\\', '');

    return res.status(200).json({
        data: (await streamResult.response).candidates[0].content.parts[0].text,
        // data: resp,
        message: 'vision controller working...!'
    });
};

const UserController = {
    registerUserByEmail: wrapAsync(registerUserByEmail),
    sendOtpOnEmail: wrapAsync(sendOtpOnEmail),
    verifyOTP: wrapAsync(verifyOTP),
    updateEmailPassword: wrapAsync(updateEmailPassword),
    loginWithEmail: wrapAsync(loginWithEmail),
    updateProfile: wrapAsync(updateProfile),
    getAllUsers: wrapAsync(getAllUsers),
    getUser: wrapAsync(getUser),
    deleteUser: wrapAsync(deleteUser),
    dropUserCollection: wrapAsync(dropUserCollection),
    getUserFromToken: wrapAsync(getUserFromToken),
    getProfile: wrapAsync(getProfile),
    deleteMyAccount: wrapAsync(deleteMyAccount),
    visionApi: wrapAsync(visionApi)
};

module.exports = UserController;
