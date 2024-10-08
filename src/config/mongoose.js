const mongoose = require('mongoose');
const config = require('./config');
const cluster = require('cluster');
const INITIALIZE = require('../helpers/initialize');

const {
    server: { mongoHost, mongoPort, db, poolSize }
} = config;

const mongoUrl = `mongodb://${mongoHost}:${mongoPort}/${db}?maxPoolSize=${poolSize}`;

// Making MongoDB Connection using mongoose
exports.connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
        .connect(mongoUrl)
        .then(() => {
            if (cluster.isMaster) console.log('Successfully connected to mongo database');

            // Create admin for the first time when not exist
            INITIALIZE();
        })
        .catch((error) => {
            console.log('Mongo connection failed. exiting now...');
            console.error(error);
            /* eslint-disable */
            process.exit(1);
            /* eslint-disable */
        });
};
