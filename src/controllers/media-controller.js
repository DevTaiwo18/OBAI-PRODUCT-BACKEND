const config = require('../config/config');
const { ErrorHandler } = require('../utils/error-handler');
const { wrapAsync } = require('../utils/wrapAsync');
const fs = require('fs');

const uploadMedia = (req, res) => {
    let resp = [];

    if (req.files.length) {
        resp = req.files.reduce((a, b) => {
            a = [...a, { path: `${config.server.backendLink}/${b.path}` }];
            return a;
        }, []);
    }

    return res.json({
        data: resp,
        message: 'Media Upload successfully'
    });
};

const deleteMedia = (req, res) => {
    const { filePath } = req.body;
    let message = '';

    if (!fs.existsSync(filePath)) {
        throw new ErrorHandler(400, 'File does not exist');
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            message = 'Error while deleting the file';
        } else {
            message = 'Media delete successfully';
        }
    });

    return res.json({ message: message || 'Media delete successfully' });
};

const MediaController = {
    uploadMedia: wrapAsync(uploadMedia),
    deleteMedia: wrapAsync(deleteMedia)
};

module.exports = MediaController;
