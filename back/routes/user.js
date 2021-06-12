const express = require('express');

const { isNotLoggedIn, isLoggedIn } = require('../utils/checkLoginMiddleware');
const { avatarImageUpload } = require('../utils/multer');
const {
  patchBookmarkToPost,
  deleteBookmarkToPost,
  postLogout,
  patchUser,
  postUser,
  postUserLogin,
  getUserPosts,
  getUserBookmark,
  postAvatar,
  getUserTemps,
} = require('../controllers/user');

const userRouter = express.Router();

userRouter.post('/login', isNotLoggedIn, postUserLogin);

userRouter.get('/', (req, res) => {
  return res.json(req.user || false);
});

userRouter.post('/', isNotLoggedIn, postUser);

userRouter.patch('/', patchUser);

userRouter.get('/:userId');
userRouter.get('/:userId/posts', getUserPosts);
userRouter.get('/:userId/temps', getUserTemps);
userRouter.get('/:userId/bookmark', getUserBookmark);
userRouter
  .route('/:userId/bookmarks/:postId')
  .patch(patchBookmarkToPost)
  .delete(deleteBookmarkToPost);
userRouter.get('/:userId/temp');

userRouter.post('/avatar', avatarImageUpload.single('image'), postAvatar);

userRouter.post('/logout', isLoggedIn, postLogout);

module.exports = userRouter;
