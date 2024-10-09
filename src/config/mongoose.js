const mongoose = require('mongoose');
const config = require('./config');
const cluster = require('cluster');
const INITIALIZE = require('../helpers/initialize');

// Extract environment variables for MongoDB connection
const { server: { mongoURI } } = config;

// Making MongoDB Connection using mongoose
exports.connect = () => {
    mongoose.set('strictQuery', true);

    // Use MongoDB URI from environment variables (MongoDB Atlas or local MongoDB)
    mongoose
        .connect(mongoURI)  // Removed deprecated options
        .then(() => {
            if (cluster.isMaster) {
                console.log('Successfully connected to MongoDB database');
            }

            // Initialize admin or other first-time setups if necessary
            INITIALIZE();
        })
        .catch((error) => {
            console.log('MongoDB connection failed. Exiting now...');
            console.error(error);
            process.exit(1); // Exit the application if unable to connect
        });
};
