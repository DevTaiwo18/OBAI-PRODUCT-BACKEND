const mongoose = require('mongoose');

// Middleware to check if a resource exists
const checkResourceExists = (modelName) => {
    return async (req, res, next) => {
        const Model = mongoose.model(modelName);
        try {
            const resource = await Model.findById(req.params.id);
            if (!resource) {
                return res.status(404).send({ message: `${modelName} not found` });
            }
            req.resource = resource; // Optional: Attach resource to the request object
            next();
        } catch (error) {
            res.status(500).send({ message: `Error accessing ${modelName}` });
        }
    };
};

module.exports = checkResourceExists;
