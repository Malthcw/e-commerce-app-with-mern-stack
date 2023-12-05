const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
} = require('../controllers/userCtrl');

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/users', getAllUsers);
router.get('/user/:id', getOneUser);
router.delete('/user/:id', deleteOneUser);
router.put('/user/:id', updateOneUser);

module.exports = router;
