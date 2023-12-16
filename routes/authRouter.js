const express = require('express');
const {
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
} = require('../controllers/userCtrl');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', createUser);
router.post('/forgotpassword', frogotPassword);
router.put('/updatepassword', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.get('/users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.get('/:id', authMiddleware, isAdmin, getOneUser);
router.delete('/:id', deleteOneUser);
router.put('/edit', authMiddleware, updateOneUser);
router.put('/blockuser/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblockuser/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
