const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getallCategory,
} = require('../controllers/productCategoryCtr');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/:id', authMiddleware, isAdmin, getaCategory);
router.get('/', authMiddleware, isAdmin, getallCategory);

module.exports = router;
