const Coupon = require('../models/coupenModel');
const validateMongodbID = require('../utils/validateMongodbID');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const Coupons = await Coupon.find();
    res.json(Coupons);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const updateCoupons = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const DeleteCoupons = await Coupon.findByIdAndDelete(id);
    res.json(DeleteCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };
