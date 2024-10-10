// Load environment variables
require('dotenv').config();

const http = require('http');
const cluster = require('cluster');
const app = require('./app'); // Import your Express app
const config = require('./src/config/config'); // Ensure this path is correct
const numCPUs = require('os').cpus().length;
const cron = require('node-cron');

// Set number of clusters (default: CPU count)
const numClusters = parseInt(config.clusterSize || numCPUs);

// Get port from environment
const port = process.env.PORT || config.server.port;

// CORS configuration
const cors = require('cors');
app.use(cors({
    origin: process.env.UI_LINK,
    credentials: true,  // Include credentials if using session cookies
}));

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is setting up ${numClusters} workers...`);

    // Fork workers based on number of clusters
    for (let i = 0; i < numClusters; i++) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        console.log(`Worker ${worker.process.pid} is online.`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        handleWorkerExit(worker, code, signal);
    });
} else {
    // Set up the cron jobs for worker 1
    if (cluster.worker.id === 1) {
        setupCronJobs();
    }

    // Create HTTP server for each worker
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Worker ${cluster.worker.id} running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} environment with process ID ${cluster.worker.process.pid}`);
    });

    server.on('error', err => {
        handleServerError(err, server);
    });
}

// Function to handle worker exit and restart
function handleWorkerExit(worker, code, signal) {
    console.error(`Handling worker exit. Worker ID: ${worker.id}, PID: ${worker.process.pid}, Exit Code: ${code}, Signal: ${signal}`);
    cluster.fork(); // Restart the worker
}

// Function to handle server errors
function handleServerError(err, server) {
    console.error(`Handling server error: ${err.message}`);
    server.close(() => {
        console.log('Server shut down due to an error.');
        process.exit(1);
    });
}

// Function to set up cron jobs
function setupCronJobs() {
    cron.schedule('* * * * *', () => {
        console.log('Cron job executed every minute');
        // Add cron job logic here
    });

    console.log('Cron jobs set up by worker ' + cluster.worker.id);
}
