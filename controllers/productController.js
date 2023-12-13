const AsyncHandler = require('express-async-handler');
const product = require('../models/productModel.');
const slugify = require('slugify');

const createProduct = AsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await product.findById(id);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the found product
    Object.assign(updatedProduct, req.body);
    await updatedProduct.save();

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deleteProduct = await product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(deleteProduct);
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

module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
