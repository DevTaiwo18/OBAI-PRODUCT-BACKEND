const ClaimSchemaDB = require('../models/claim');

const createData = async (payloadData) => await ClaimSchemaDB(payloadData).save();

const updateData = async (id, updateData) => await ClaimSchemaDB.findByIdAndUpdate(id, { ...updateData }, { new: true });

const getAllData = async (filter) => await ClaimSchemaDB.find(filter).sort({ createdAt: -1 });

const getDataByID = async (id, filter) => await ClaimSchemaDB.findById(id, filter);

const deleteDataByID = async (id, filter = {}) =>
    await ClaimSchemaDB.findOneAndUpdate(
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

const archiveClaims = async (documentIds, isArchive) => await ClaimSchemaDB.updateMany({ _id: { $in: documentIds } }, { $set: isArchive });

const getCount = async (filter) => await ClaimSchemaDB.countDocuments(filter);

const getAllClaimsPagination = async (query, limit, skip) => await ClaimSchemaDB.find(query, { password: 0 }).limit(limit).skip(skip);

const updateAll = async () => await ClaimSchemaDB.updateMany({}, { $set: { isArchive: false } });

const ClaimServices = {
    createData,
    updateData,
    getAllData,
    getDataByID,
    deleteDataByID,
    archiveClaims,
    getCount,
    getAllClaimsPagination,
    updateAll
};

module.exports = ClaimServices;
