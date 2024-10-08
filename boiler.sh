#!/bin/bash

# Prompt for the file name
read -p "Enter the name of the file you want to create: " filename

lowerCaseName=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
capitalizeName=$(echo "${filename}" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

# Check if the file already exists
if [ -e "./src/routes/$filename.js" ]; then
    echo "File \"$filename\" already exists."
else

    # ================================== Create the file in models ==========================
    echo "1️⃣ Creating Model"
    touch ./src/models/$lowerCaseName.js

    # Add boilerplate code to the file
    echo "
const mongoose = require('mongoose');

const ${lowerCaseName}Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ${capitalizeName}SchemaDB = mongoose.model('${lowerCaseName}', ${lowerCaseName}Schema);
module.exports = ${capitalizeName}SchemaDB;
" >>./src/models/$lowerCaseName.js

    # ================================== Create the file in services ==========================
    echo "2️⃣ Creating Service"
    touch ./src/services/$lowerCaseName.js

    # Add boilerplate code to the file
    echo "
const ${capitalizeName}SchemaDB = require('../models/${lowerCaseName}');

const createData = async (payloadData) => await ${capitalizeName}SchemaDB(payloadData).save();

const updateData = async (id, updateData) => 
await ${capitalizeName}SchemaDB.findByIdAndUpdate(id, { ...updateData }, { new: true });

const getAllData = async (filter) => await ${capitalizeName}SchemaDB.find(filter);

const getDataByID = async (id, filter) => await ${capitalizeName}SchemaDB.findById(id, filter);

const deleteDataByID = async (id, filter) => await ${capitalizeName}SchemaDB.findOneAndUpdate(
    { _id: id, ...filter },
    {
      isDeleted: true,
      deleteDate: new Date()
    },
    {
      new: true,
    }
  );

const ${capitalizeName}Services = {
  createData,
  updateData,
  getAllData,
  getDataByID,
  deleteDataByID,
};

module.exports = ${capitalizeName}Services;
" >>./src/services/$lowerCaseName.js

    # # ================================== Create the file in controller ==========================
    echo "3️⃣ Creating Controller"
    touch ./src/controllers/$lowerCaseName.js

    # Add boilerplate code to the file
    echo "
const ${capitalizeName}Services = require('../services/${lowerCaseName}');
const { wrapAsync } = require('../utils/wrapAsync');

const createData = async (req, res) => {
  const payloadData = req.body;

  const resp = await ${capitalizeName}Services.createData(payloadData);

  return res.status(201).json({
    data: resp,
    message: 'Record saved successfully',
  });
};

const updateData = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const resp = await ${capitalizeName}Services.updateData(id, updateData);

  return res.status(200).json({
    data: resp,
    message: 'Record update successfully',
  });
};

const getData = async (req, res) => {
  let resp = null;

  const filter = Object.keys(req.query).reduce((a, b) => {
    a[b] = req.query[b];
    return a;
  }, {});

  if (req.params?.id)
    resp = await ${capitalizeName}Services.getDataByID(req.params?.id, filter);
  else resp = await ${capitalizeName}Services.getAllData(filter);

  return res.status(200).json({
    data: resp,
    message: 'Record fetch successfully',
  });
};

const deleteDataByID = async (req, res) => {
  const { id } = req.params;

  const filter = Object.keys(req.query).reduce((a, b) => {
    a[b] = req.query[b];
    return a;
  }, {});

  const resp = await ${capitalizeName}Services.deleteDataByID(id, filter);

  return res.status(200).json({
    data: resp,
    message: 'Record delete successfully',
  });
};

const ${capitalizeName}Controller = {
  createData: wrapAsync(createData),
  updateData: wrapAsync(updateData),
  getData: wrapAsync(getData),
  deleteDataByID: wrapAsync(deleteDataByID),
};

module.exports = ${capitalizeName}Controller;

" >>./src/controllers/$lowerCaseName.js

    # ================================== Create the file in validator ==========================
    echo "4️⃣ Creating Validator"
    touch ./src/request-schemas/$lowerCaseName.js

    # Add boilerplate code to the file
    echo "
const { Joi, Segments } = require('celebrate');

const createData = {
  [Segments.BODY]: Joi.object().keys({
    userName: Joi.string().required('user name is required'),
  }),
};

const getDataByID = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required('id is required'),
  }),
};

const ${capitalizeName}Validator = {
  createData,
  getDataByID
};

module.exports = ${capitalizeName}Validator;

" >>./src/request-schemas/$lowerCaseName.js

    # # ================================== Create the file in routes ==========================
    echo "5️⃣ Creating Route"
    touch ./src/routes/$lowerCaseName.js

    # Add boilerplate code to the file
    echo "
const express = require('express');
const ${lowerCaseName}Router = express.Router();
const { celebrate } = require('celebrate');
const ${capitalizeName}Validator = require('../request-schemas/${lowerCaseName}');
const ${capitalizeName}Controller = require('../controllers/${lowerCaseName}');

const API = {
  CREATE: '/',
  UPDATE: '/:id',
  GET: '/',
  GET_BY_ID: '/:id',
  DELETE: '/:id',
};


${lowerCaseName}Router.post(
  API.CREATE,
  celebrate(${capitalizeName}Validator.createData),
  ${capitalizeName}Controller.createData
);

${lowerCaseName}Router.put(
  API.UPDATE,
  ${capitalizeName}Controller.updateData
);


${lowerCaseName}Router.get(
  API.GET,
  ${capitalizeName}Controller.getData
);
 
${lowerCaseName}Router.get(
  API.GET_BY_ID,
  celebrate(${capitalizeName}Validator.getDataByID),
  ${capitalizeName}Controller.getData
);

${lowerCaseName}Router.delete(
  API.DELETE,
  celebrate(${capitalizeName}Validator.getDataByID),
  ${capitalizeName}Controller.deleteDataByID
);

module.exports = ${lowerCaseName}Router;

" >>./src/routes/$lowerCaseName.js

echo "⭐️⭐️⭐️ Basic $capitalizeName CRUD has beem setup for you. Enjoy 😊. Happy coding ...!"
fi
