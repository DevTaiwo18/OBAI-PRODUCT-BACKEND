// Load environment variables
const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.error('Warning: Unable to load .env file. Defaulting to environment variables.');
}

const http = require('http');
const cluster = require('cluster');
const app = require('./app'); // Ensure this path is correctly set
const config = require('./src/config/config'); // Ensure this path is correctly set
const numCPUs = require('os').cpus().length;
const cron = require('node-cron'); // Include node-cron

// Configurable number of clusters, defaulting to number of CPUs
const numClusters = parseInt(config.clusterSize || numCPUs);

const port = config.server.port;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is setting up ${numClusters} workers...`);

    for (let i = 0; i < numClusters; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log(`Worker ${worker.process.pid} is online.`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        handleWorkerExit(worker, code, signal);
    });
} else {
    if (cluster.worker.id === 1) {
        // This worker will run the cron jobs
        // setupCronJobs();
    }

    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(
            `Worker ${cluster.worker.id} running on http://${server.address().address}:${server.address().port} at ${new Date().toString()} on ${config.server.nodeEnv} environment with process ID ${
                cluster.worker.process.pid
            }`
        );
    });

    server.on('error', (err) => {
        handleServerError(err, server);
    });
}

function handleWorkerExit(worker, code, signal) {
    console.error(`Handling worker exit. Worker ID: ${worker.id}, PID: ${worker.process.pid}, Exit Code: ${code}, Signal: ${signal}`);
    cluster.fork(); // Restart the worker
}

function handleServerError(err, server) {
    console.error(`Handling server error: ${err.message}`);
    server.close(() => {
        console.log('Server shut down due to an error.');
        /* eslint-disable */
        process.exit(1);
        /* eslint-disable */
    });
}

function setupCronJobs() {
    cron.schedule('* * * * *', () => {
        console.log('Cron job executed every minute');
        // Your cron job logic here
    });

    console.log('Cron jobs set up by worker ' + cluster.worker.id);
}
