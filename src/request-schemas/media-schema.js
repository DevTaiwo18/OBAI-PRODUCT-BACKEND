const { Joi, Segments } = require('celebrate');

const mediaDelete = {
    [Segments.BODY]: Joi.object().keys({
        filePath: Joi.string().required()
    })
};

const MediaValidator = {
    mediaDelete
};

module.exports = MediaValidator;
