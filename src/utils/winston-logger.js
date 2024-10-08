const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

const isProd = process.env.NODE_ENV === 'production';

const logsDirectory = path.join(__dirname, '..', '..', 'logs');
const expressLogsDirectory = path.join(logsDirectory, 'express');
const expressErrorsLogsDirectory = path.join(logsDirectory, 'express-errors');

// ensure log directory exists
fs.existsSync(expressLogsDirectory) || fs.mkdirSync(expressLogsDirectory, { recursive: true });
fs.existsSync(expressErrorsLogsDirectory) || fs.mkdirSync(expressErrorsLogsDirectory, { recursive: true });

const tsFormat = () => new Date().toLocaleTimeString();

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
);

// Creating own logger object to use all over project
const logger = winston.createLogger({
    format: logFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        new DailyRotateFile({
            filename: `${expressLogsDirectory}/express-logs.log`,
            timestamp: tsFormat,
            datePattern: 'YYYY-MM-DD',
            prepend: true
        })
    ]
});

// Middleware for logging simple req on console
const expressLogger = expressWinston.logger({
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
    meta: false, // Show meta info like headers or not
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms' // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
});

// For Logging Errors via Middleware
const expressErrorLogger = expressWinston.errorLogger({
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: `${expressErrorsLogsDirectory}/error-logs.log`,
            timestamp: tsFormat,
            handleExceptions: true,
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: isProd ? 'info' : 'verbose'
        })
    ],
    exitOnError: false // If false, handled exceptions will not cause process.exit
});

module.exports = {
    expressLogger,
    expressErrorLogger,
    logger
};
