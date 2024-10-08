const CONSTANT_ENUM = require('../helpers/constant-enums');
const ClaimServices = require('../services/claim');
const { ErrorHandler } = require('../utils/error-handler');
const { wrapAsync } = require('../utils/wrapAsync');

const createData = async (req, res) => {
    const payloadData = req.body;

    const resp = await ClaimServices.createData(payloadData);

    return res.status(201).json({
        data: resp,
        message: 'Record saved successfully'
    });
};

const updateData = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const resp = await ClaimServices.updateData(id, updateData);

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

    if (req.params?.id) resp = await ClaimServices.getDataByID(req.params?.id, filter);
    else resp = await ClaimServices.getAllData(filter);

    return res.status(200).json({
        data: resp,
        message: 'Record fetch successfully'
    });
};

const deleteDataByID = async (req, res) => {
    const { id } = req.params;

    const resp = await ClaimServices.deleteDataByID(id);

    return res.status(200).json({
        data: resp,
        message: 'Record delete successfully'
    });
};

const archiveClaims = async (req, res) => {
    const { ids, isArchive } = req.body;

    const resp = await ClaimServices.archiveClaims(ids, { isArchive });

    return res.status(200).json({
        data: resp,
        message: `${ids?.length > 1 ? 'Claims' : 'Claim'} ${isArchive ? 'Archived' : 'Unarchive'} successfully`
    });
};

const getAllClaimsPagination = async (req, res) => {
    const { limit, pageNumber } = req.query;

    const query = {};

    if (pageNumber <= 0) {
        throw new ErrorHandler(400, "Page number can't be zero");
    }

    // if (searchTerm) {
    //     query = { userName: { $regex: searchTerm, $options: 'i' } };
    // }

    const total = await ClaimServices.getCount({ isDelete: false });

    const createLimit = limit * pageNumber;
    const startIndex = pageNumber === 1 ? 0 : createLimit - limit;
    const currentTotal = limit * pageNumber;
    const isNext = currentTotal >= total;

    const resp = await ClaimServices.getAllClaimsPagination(query, limit, startIndex);

    return res.status(200).json({
        total,
        isNext: !isNext,
        data: resp,
        message: 'Record fetch successfully'
    });
};

const submit = async (req, res) => {
    const { claimID, dentList } = req.body;
    let message = 'Claim submit successfully';
    let resp = null;

    const claim = await ClaimServices.getDataByID(claimID);

    if (!claim) throw new ErrorHandler(400, 'Claim not found');

    if (claim?.status === CONSTANT_ENUM.STATUS.PENDING) {
        resp = await ClaimServices.updateData(claimID, { dentInfo: dentList, status: CONSTANT_ENUM.STATUS.SUBMITTED });
    } else {
        resp = claim;
        message = 'Claim already submitted';
    }

    return res.status(200).json({ data: resp, message });
};

const updateAll = async (req, res) => {
    const resp = await ClaimServices.updateAll();
    return res.status(200).json({ data: resp });
};

const ClaimController = {
    createData: wrapAsync(createData),
    updateData: wrapAsync(updateData),
    getData: wrapAsync(getData),
    deleteDataByID: wrapAsync(deleteDataByID),
    archiveClaims: wrapAsync(archiveClaims),
    getAllClaimsPagination: wrapAsync(getAllClaimsPagination),
    submit: wrapAsync(submit),
    updateAll: wrapAsync(updateAll)
};

module.exports = ClaimController;
