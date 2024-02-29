const Category = require('../models/ProductCategoryModel');
const AsyncHandler = require('express-async-handler');
const validateMongodbID = require('../utils/validateMongodbID');

const createCategory = AsyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getaCategory = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbID(id);
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getallCategory = AsyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getallCategory,
};
