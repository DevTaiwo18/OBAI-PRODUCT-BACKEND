const express = require('express');
const mediaRouter = express.Router();
const multer = require('multer');
const MediaController = require('../controllers/media-controller');
const { celebrate } = require('celebrate');
const MediaValidator = require('../request-schemas/media-schema');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },

    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}-${String(file.originalname).replaceAll(' ', '-')}`);
    }
});

const upload = multer({ storage: fileStorage });

mediaRouter.post('/upload', upload.array('files'), MediaController.uploadMedia);

mediaRouter.post('/delete', celebrate(MediaValidator.mediaDelete), MediaController.deleteMedia);

module.exports = mediaRouter;
