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
  uploadImages,

} = require('../controllers/blogController');
const { blogsImageResize, uploadPhoto } = require('../middleware/uploadimages');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put(
  '/upload/:id',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 2),
  blogsImageResize,
  uploadImages
);
router.put('/likes', authMiddleware, isAdmin, likeBlog);
router.put('/dislikes', authMiddleware, isAdmin, dislikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getallBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

module.exports = router;
