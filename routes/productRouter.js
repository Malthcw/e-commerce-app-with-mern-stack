const express = require('express');
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
} = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { uploadPhoto, productImageResize } = require('../middleware/uploadimages');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.put(
  '/upload/:id',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 5),
  productImageResize,
  uploadImages
);
router.get('/:id', getaProduct);
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/', authMiddleware, isAdmin, getAllProducts);
router.delete('/:id', deleteProduct);

module.exports = router;
