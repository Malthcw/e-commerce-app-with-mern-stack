const express = require('express');
const {
  createProduct,
  getaProduct,
  getAllProducts,
} = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/products', getAllProducts);
router.get('/:id', getaProduct);

module.exports = router;
