const UserSchemaDB = require('../models/user-model');

const createUser = async (postData) => await UserSchemaDB.create(postData);
const getUserByEmail = async (email) => await UserSchemaDB.findOne({ email }).lean();

const getAllUsers = async () => await UserSchemaDB.find();

const getNumberOfUsers = async (filter = {}) => await UserSchemaDB.countDocuments(filter);

const getUser = async (filter) => await UserSchemaDB.findOne({ ...filter });

const updateUserByID = async (id, updateData) => await UserSchemaDB.findByIdAndUpdate(id, { ...updateData }, { new: true });

const updateUserByEmail = async (email, updateData) => await UserSchemaDB.findOneAndUpdate({ email }, { ...updateData }, { new: true });

const getUserByID = async (id) => await UserSchemaDB.findOne({ _id: id }).lean();

const dropUserCollection = async () => {
    await UserSchemaDB.db.syncIndexes();
    await UserSchemaDB.collection.drop();
};

const UserServices = {
    createUser,
    getUserByEmail,
    getAllUsers,
    getNumberOfUsers,
    getUser,
    updateUserByID,
    updateUserByEmail,
    getUserByID,
    dropUserCollection
};

module.exports = UserServices;
