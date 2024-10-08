const config = require('../config/config');
const bcrypt = require('bcrypt');
const AdminServices = require('../services/admin');
const CONSTANT_ENUM = require('./constant-enums');

const INITIALIZE = async () => {
    try {
        const data = {
            email: config.server.adminEmail,
            password: await bcrypt.hash(config.server.adminPassword, 10),
            role: CONSTANT_ENUM.USER_ROLE.ADMIN,
            userName: 'Harry lauren'
        };

        const admin = await AdminServices.getData({ email: config.server.adminEmail });

        if (!admin) {
            const resp = await AdminServices.createData(data);
            // TODO: LOG NEEDED HERE
            console.log({ message: 'Admin created', resp });
        }
    } catch (error) {
        throw new Error('Admin not created');
    }
};

module.exports = INITIALIZE;
