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
const { isLoggedIn } = require('../utils/checkLoginMiddleware');
const { postImageUpload } = require('../utils/multer');

const postRouter = express.Router();

postRouter.route('/', isLoggedIn).post(postPost);

postRouter.route('/:postId').get(getPost);

// ! 이후 경로는 전부 로그인이 필요
postRouter.use(isLoggedIn);

postRouter
  .route('/:postId') //
  .patch(patchPost) //
  .delete(deletePost);

postRouter
  .route('/:postId/image')
  .post(postImageUpload.single('image'), postImage);

postRouter
  .route('/:postId/comment') //
  .post(postCommentToPost);

postRouter
  .route('/:postId/comment/:commentId') //
  .delete(deleteCommentToPost);

module.exports = postRouter;
