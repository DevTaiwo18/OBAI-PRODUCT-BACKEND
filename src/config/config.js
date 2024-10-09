const config = {
    server: {
        mongoURI: process.env.MONGO_DB_URI || `mongodb://${process.env.MONGO_DB_HOST || '127.0.0.1'}:${parseInt(process.env.MONGO_DB_PORT || '27017')}/${process.env.MONGO_DB || 'template'}`,
        poolSize: process.env.MONGO_POOL_SIZE || '100',
        route: process.env.ROUTE || 'api',
        port: process.env.PORT || '4000',
        nodeEnv: process.env.NODE_ENV || 'dev',
        jwtSecretKey: process.env.JWT_SECRET,
        backendLink: process.env.BACKEND_LINK || '',
        smtpMail: process.env.SMTP_MAIL || '',
        smtpPassword: process.env.SMTP_PASS || '',
        adminEmail: 'admin@admin.com',
        adminPassword: 'admin123'
    }
};

module.exports = config;
