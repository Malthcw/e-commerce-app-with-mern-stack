const mongoose = require('mongoose');
const validateMongodbID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error('Invalid ID or Not Found');
  }
};
module.exports = validateMongodbID;
