const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getaBrand,
  getallBrand,
} = require('../controllers/brandCtrl');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', authMiddleware, isAdmin, getaBrand);
router.get('/', authMiddleware, isAdmin, getallBrand);

module.exports = router;
