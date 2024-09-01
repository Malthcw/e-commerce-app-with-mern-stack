const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const fs = require('fs');
const AsyncHandler = require('express-async-handler');
const validateMongodbID = require('../utils/validateMongodbID');
const cloudinaryuploadImage = require('../utils/cloudinary');

const createBlog = AsyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate('likes')
      .populate('dislikes');
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numView: 1 },
      },
      {
        new: true,
      }
    );
    res.json({
      getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getallBlog = AsyncHandler(async (req, res) => {
  try {
    const getallBlog = await Blog.find();
    res.json({
      getallBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = AsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbID(blogId);
  //find the Blog want to like
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isLiked = blog?.isLiked;
  //find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

const dislikeBlog = AsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbID(blogId);
  //find the Blog want to like
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  //find if the user has disliked the blog
  const alreadyliked = blog?.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

const uploadImages = AsyncHandler(async (req, res) => {
  const {id} = req.params;
  validateMongodbID(id);
  console.log(req.files);
  try {
    const uploader = (path) => cloudinaryuploadImage(path, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        image: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch(error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getallBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages
};
