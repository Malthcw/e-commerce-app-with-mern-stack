const express = require('express');
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/:id', getaProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/', authMiddleware, isAdmin, getAllProducts);
router.delete('/:id', deleteProduct);

module.exports = router;
