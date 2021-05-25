const { Post, Image, Comment, User, Hashtag } = require('../models');
module.exports = {
  postPost: async (req, res, next) => {
    try {
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      const post = await Post.create({
        content: req.body.content,
        UserId: req.user.id,
      });
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map(tag =>
            Hashtag.findOrCreate({
              where: { name: tag.slice(1).toLowerCase() },
            }),
          ),
        );
        await post.addHashtags(result.map(v => v[0]));
      }
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          const images = await Promise.all(
            req.body.image.map(image => Image.create({ src: image })),
          );
          await post.addImages(images);
        } else {
          const image = await Image.create({ src: req.body.image });
          await post.addImages(image);
        }
      }
      const fullPost = await Post.findOne({
        where: { id: post.id },
        include: [
          {
            model: Image,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ['id', 'nickname'],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'nickname'],
          },
        ],
      });
      res.status(201).json(fullPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getPost: null,
  patchPost: null,
  deletePost: null,
  postCommentToPost: null,
  deleteCommentToPost: null,
  patchBookmarkToPost: null,
  deleteBookmarkToPost: null,
};
