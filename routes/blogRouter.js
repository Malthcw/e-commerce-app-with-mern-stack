const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const {
  createBlog,
  updateBlog,
  getBlog,
  getallBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require('../controllers/blogController');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, isAdmin, likeBlog);
router.put('/dislikes', authMiddleware, isAdmin, dislikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getallBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

module.exports = router;
