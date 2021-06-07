const { Post, User } = require('../models');

module.exports = {
  patchBookmarkToPost: async (req, res, next) => {
    try {
      const post = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!post) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }
      const user = await User.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }
      await post.addMarker(user);
      return res.status(201).send('북마크 성공');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteBookmarkToPost: async (req, res, next) => {
    try {
      const post = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!post) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }
      const user = await User.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }
      await post.removeMarker(user);
      return res.status(201).send('북마크 취소');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
