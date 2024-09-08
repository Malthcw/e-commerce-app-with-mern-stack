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
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  updateOrderStatus
} = require('../controllers/userCtrl');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', createUser);
router.post('/forgotpassword', frogotPassword);
router.put('/resetpassword/:token', resetPassword);
router.put('/update-order/:id', authMiddleware,isAdmin, updateOrderStatus);
router.put('/updatepassword', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin.login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.post('/cart/cash.order', authMiddleware, createOrder);
router.get('/users', getAllUsers);
router.get('/orders', authMiddleware,getOrder);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.get('/whishlist', authMiddleware, getWishList);
router.get('/cart', authMiddleware, getUserCart);

router.get('/:id', authMiddleware, isAdmin, getOneUser);
router.delete('/empty.cart', authMiddleware, emptyCart);
router.delete('/:id', deleteOneUser);

router.put('/edit', authMiddleware, updateOneUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/blockuser/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblockuser/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
