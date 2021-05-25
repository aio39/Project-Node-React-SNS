const express = require('express');
const {
  postPost,
  getPost,
  patchPost,
  deletePost,
  postCommentToPost,
  deleteCommentToPost,
  patchBookmarkToPost,
  deleteBookmarkToPost,
} = require('../controllers/post');
const { isNotLoggedIn, isLoggedIn } = require('../utils/checkLoginMiddleware');
const postRouter = express.Router();

postRouter.route('/', isLoggedIn).post(postPost);

postRouter.route('/:postId').get(getPost).patch(patchPost).delete(deletePost);

postRouter
  .route('/postId/comment')
  .post(postCommentToPost)
  .delete(deleteCommentToPost);

postRouter
  .route('/:postId/bookmark')
  .patch(patchBookmarkToPost)
  .delete(deleteBookmarkToPost);

module.exports = postRouter;
