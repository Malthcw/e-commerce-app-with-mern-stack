const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } else {
    throw new Error('User already exists');
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid email or password');
  }
});

const updateOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateAuser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updateAuser);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find({});
    res.json(getUsers);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getAuser = await User.findById(id);
    res.json(getAuser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAuser = await User.findByIdAndDelete(id);
    res.json(deleteAuser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
};
