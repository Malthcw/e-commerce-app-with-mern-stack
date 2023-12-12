const AsyncHandler = require('express-async-handler');
const product = require('../models/productModel.');

const createProduct = AsyncHandler(async (req, res) => {
  try {
    const newProduct = await product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = AsyncHandler(async (req, res) => {
  try {
    const getproducts = await product.find();
    res.json(getproducts);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getaProduct, getAllProducts };
