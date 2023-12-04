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
    res.json(findUser);
  } else {
    throw new Error('Invalid email or password');
  }
});

module.exports = { createUser, loginUserCtrl };
