const { Post, Image, Comment, User, Hashtag } = require('../models');
const { getPostIdAndUserId } = require('../utils/helper');

const createHashtags = async hashtags => {
  return await Promise.all(
    hashtags.map(tag =>
      Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }),
    ),
  );
};

const convertDeletedComments = comments => {
  comments.map(c => {
    if (c.isDeleted === true) c.content = '삭제 된 덧글입니다.';
    if (c.Reply?.length > 0) c.Reply = convertDeletedComments(c.Reply);
    return c;
  });
};

module.exports = {
  postPost: async (req, res, next) => {
    console.log(req);
    console.log(req.isAuthenticated);
    try {
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      const post = await Post.create({
        content: req.body.content,
        title: req.body.title,
        UserId: req.user.id,
      });
      if (hashtags) {
        const result = await createHashtags(hashtags);
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
          {
            model: Hashtag,
            attributes: ['id', 'name'],
          },
        ],
      });
      res.status(201).json(fullPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getPost: async (req, res, next) => {
    try {
      const post = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!post) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }
      const fullPost = await Post.findOne({
        where: { id: post.id },
        include: [
          {
            model: User,
            attributes: ['id', 'nickname'],
          },
          {
            model: User,
            as: 'Marker',
            attributes: ['id', 'nickname'],
          },
          {
            model: Image,
          },
          {
            model: Comment,
            required: false, // ! 이 조건을 충족하지 않더라도 parent 모델을 가져옴.
            where: {
              isRoot: true,
            },
            include: [
              {
                model: User,
                attributes: ['id', 'nickname'],
              },
              {
                model: Comment,
                as: 'Reply',
                include: [
                  {
                    model: User,
                    attributes: ['id', 'nickname'],
                  },
                  {
                    model: Comment,
                    as: 'Reply',
                  },
                ],
              },
            ],
          },
          {
            model: Hashtag,
          },
        ],
      });
      console.log(fullPost.Comments);
      fullPost.Comments = convertDeletedComments(fullPost.Comments);

      res.status(200).json(fullPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  patchPost: async (req, res, next) => {
    const [content, title] = req.body;
    const body = [content, title].filter(String);

    const hashtags = req.body.content.match(/#[^\s#]+/g);
    try {
      await Post.update(
        {
          ...body,
        },
        {
          where: {
            ...getPostIdAndUserId(req),
          },
        },
      );

      const post = await Post.findOne({ where: { id: req.params.postId } });

      if (hashtags) {
        const result = await Promise.all(
          hashtags.map(tag =>
            Hashtag.findOrCreate({
              where: { name: tag.slice(1).toLowerCase() },
            }),
          ),
        );
        await post.setHashtags(result.map(v => v[0]));
      }

      res.status(200).json({
        PostId: parseInt(req.params.postId, 10),
        content: req.body.content,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deletePost: async (req, res, next) => {
    try {
      await Post.destroy({
        where: {
          ...getPostIdAndUserId(req),
        },
      });
      res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  postCommentToPost: async (req, res, next) => {
    try {
      const post = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!post) {
        return res.status(404).send('존재하지 않는 게시글입니다.');
      }

      let comment;
      if (req.body.superCommentId) {
        const superComment = await Comment.findOne({
          where: { id: req.body.superCommentId, postId: req.params.postId },
        });
        if (!superComment)
          return res.status(404).send('존재하지 않는 상위 덧글입니다.');
        comment = await Comment.create({
          content: req.body.content,
          PostId: parseInt(req.params.postId, 10),
          UserId: req.user.id,
          isRoot: false,
        });
        superComment.addReply(comment);
      } else {
        comment = await Comment.create({
          content: req.body.content,
          PostId: parseInt(req.params.postId, 10),
          UserId: req.user.id,
          isRoot: true,
        });
      }

      const fullComment = await Comment.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'avatar'],
          },
        ],
      });
      res.status(201).json(fullComment);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteCommentToPost: async (req, res, next) => {
    try {
      const comment = await Comment.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id: req.params.commentId,
          },
        },
      );
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
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
