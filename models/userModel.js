const mongoose = require('mongoose'); // Erase if already required
const bycrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,

      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type:String
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bycrypt.genSaltSync(10);
  this.password = await bycrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function() {
  const resettoken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 miniutes
  return resettoken;
};

//Export the model
module.exports = mongoose.model('User', userSchema);
