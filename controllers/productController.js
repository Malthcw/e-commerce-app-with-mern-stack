const AsyncHandler = require('express-async-handler');
const product = require('../models/productModel.');
const User = require('../models/userModel');
const slugify = require('slugify');
const { get } = require('mongoose');

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
    //Filltering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = product.find(JSON.parse(queryStr));
    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exist');
    }

    const Product = await query;
    res.json(Product);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishList = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);
    const alreadyInWishList = user.wishlist.find(
      (id) => id.toString() === prodId
    );
    if (alreadyInWishList) {
      let user = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId,comment } = req.body;

  try {
    const Product = await product.findById(prodId);
    let alreadyRated = Product.rating.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await product.updateOne(
        { rating: { $elemMatch: alreadyRated } },
        { $set: { 'rating.$.star': star, "rating.$.comment": comment } },
        { new: true }
      );
      res.json(updateRating);
    } else {
      const rateProduct = await product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
      res.json(rateProduct);
    }
    const getallratings = await product.findById(prodId);
    let totalrating = getallratings.rating.length;
    let ratingsum = getallratings.rating
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualrating = Math.round(ratingsum / totalrating);
    let finalProduct = await product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualrating,
      },
      { new: true }
    );
    res.json(finalProduct);
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
  addToWishList,
  rating,
};
