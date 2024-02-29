const Brand = require('../models/brandModel');
const AsyncHandler = require('express-async-handler');
const validateMongodbID = require('../utils/validateMongodbID');

const createBrand = AsyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getaBrand = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.json(getaBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getallBrand = AsyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getaBrand,
  getallBrand,
};
