const AdminSchemaDB = require('../models/admin');

const createData = async (payloadData) => await AdminSchemaDB(payloadData).save();

const updateData = async (id, updateData) => await AdminSchemaDB.findByIdAndUpdate(id, { ...updateData, lastVisit: new Date() }, { new: true });

const getAllData = async (filter) => await AdminSchemaDB.find(filter);

const getData = async (filter) => await AdminSchemaDB.findOne(filter);

const getDataByID = async (id) => await AdminSchemaDB.findById(id);

const deleteDataByID = async (id, filter) =>
    await AdminSchemaDB.findOneAndUpdate(
        { _id: id, ...filter },
        {
            isDeleted: true,
            deleteDate: new Date(),
            lastVisit: new Date()
        },
        {
            new: true
        }
    );

const AdminServices = {
    createData,
    updateData,
    getAllData,
    getDataByID,
    deleteDataByID,
    getData
};

module.exports = AdminServices;
