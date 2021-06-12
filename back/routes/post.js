const express = require('express');
const {
  postPost,
  getPost,
  patchPost,
  deletePost,
  postImage,
  postCommentToPost,
  deleteCommentToPost,
} = require('../controllers/post');
const { isNotLoggedIn, isLoggedIn } = require('../utils/checkLoginMiddleware');
const { postImageUpload } = require('../utils/multer');

const postRouter = express.Router();

postRouter.route('/', isLoggedIn).post(postPost);

postRouter.route('/:postId').get(getPost).patch(patchPost).delete(deletePost);

postRouter
  .route('/:postId/image')
  .post(postImageUpload.single('image'), postImage);

postRouter.route('/:postId/comment').post(postCommentToPost);

postRouter.route('/:postId/comment/:commentId').delete(deleteCommentToPost);

module.exports = postRouter;
