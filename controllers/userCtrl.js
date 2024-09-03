const { generateToken } = require('../config/jwtToken');
const Cart = require('../models/cartModel');
const product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongodbID = require('../utils/validateMongodbID');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');

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

//login user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findAdmin = await User.findOne({ email: email });
  if (findAdmin.role != 'admin') throw new Error('You are not an admin');
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findAdmin._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error('Invalid email or password');
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No refresh token found');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No user found');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id != decoded.id) {
      throw new Error('Invalid refresh token');
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No refresh token found');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken: refreshToken }, // Filter criteria
    { $set: { refreshToken: '' } }, // Update operation
    { new: true } // Options: Return the modified document
  );

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const updateOneUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const updateAuser = await User.findByIdAndUpdate(
      _id,
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

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const updateAuser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
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
  validateMongodbID(id);
  try {
    const getAuser = await User.findById(id);
    res.json(getAuser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deleteAuser = await User.findByIdAndDelete(id);
    res.json(deleteAuser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );

    res.json({
      message: 'User Blocked',
      user: blockedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    res.json({
      message: 'User Unblocked',
      user: unblockedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body.password;
  validateMongodbID(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const frogotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new Error('user not found');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi.. Please follow this link to reset your password <a href="http://localhost:3000/resetpassword/${token}">reset password</a>`;
    const data = {
      to: email,
      text: 'Hey User',
      subject: 'Reset Password',
      html: resetUrl,
    };
    console.log(data);
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error.message);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Token is invalid or expired');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const { cart } = req.body;
  validateMongodbID(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    const alreadyExistCart = await Cart.findOne({ orderedBy: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await product
        .findById(cart[i]._id)
        .select('price')
        .exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user?._id,
    }).save();
    res.json(newCart);
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
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  frogotPassword,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
};
