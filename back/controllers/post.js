const { urlencoded } = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { Post, Image, Comment, User, Hashtag, sequelize } = require('../models');
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

const addImagesToPost = async (post, imageUrls) => {
  const images = await Promise.all(
    imageUrls.map(image => Image.create({ src: image })),
  );
  await post.addImages(images);
};

module.exports = {
  postPost: async (req, res, next) => {
    console.log(req);
    console.log(req.isAuthenticated);
    try {
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      let content = req.body.content.toString();
      content = content.replace(/#[^\s#]+/g, '');
      const post = await Post.create({
        content,
        title: req.body.title,
        UserId: req.user.id,
      });
      if (hashtags) {
        const result = await createHashtags(hashtags);
        await post.addHashtags(result.map(v => v[0]));
      }
      if (req.body.image?.length > 0) {
        await addImagesToPost(post, req.body.image);
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
      const MarkerWhere = {};
      if (req.user?.id) MarkerWhere.id = req.user.id;

      const fullPost = await Post.findOne({
        where: { id: post.id },
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'avatar'],
          },
          {
            model: User,
            as: 'Marker',
            where: MarkerWhere,
            attributes: ['id'],
            required: false,
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
                attributes: ['id', 'nickname', 'avatar'],
              },
              {
                model: Comment,
                as: 'Reply',
                include: [
                  {
                    model: User,
                    attributes: ['id', 'nickname', 'avatar'],
                  },
                  {
                    model: Comment,
                    as: 'Reply',
                    include: [
                      {
                        model: User,
                        attributes: ['id', 'nickname', 'avatar'],
                      },
                    ],
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
      if (fullPost.Comments?.length > 0) {
        fullPost.Comments = convertDeletedComments(fullPost.Comments);
      }

      const count = await sequelize.query(
        `select count(PostId) as count from BookMark where PostId = ${req.params.postId};`,
        { type: Sequelize.QueryTypes.SELECT },
      );
      fullPost.dataValues.count = count[0].count;

      res.status(200).json(fullPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  patchPost: async (req, res, next) => {
    console.log(req.body);
    const { content, title, image, deletedImagesId } = req.body;
    const body = { content, title };
    console.log(body);
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
      if (image?.length > 0) {
        await addImagesToPost(post, req.body.image);
      }

      if (deletedImagesId.length > 0) {
        await Image.destroy({
          where: {
            id: {
              [Op.or]: deletedImagesId,
            },
          },
        });
      }
      // if (hashtags) {
      //   const result = await Promise.all(
      //     hashtags.map(tag =>
      //       Hashtag.findOrCreate({
      //         where: { name: tag.slice(1).toLowerCase() },
      //       }),
      //     ),
      //   );
      //   await post.setHashtags(result.map(v => v[0]));
      // }

      res.status(200).json({
        id: parseInt(req.params.postId, 10),
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
  postImage: async (req, res, next) => {
    console.log(req.file);
    const image = req.file?.location;
    if (image === undefined) {
      return res.status(400).send('이미지가 존재하지 않습니다.');
    }
    return res.status(200).json(image);
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

  getPosts: async (req, res, next) => {
    try {
      const { tag } = req.query;
      const where = {};
      if (parseInt(req.query.lastId, 10)) {
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      }

      const posts = await Post.findAll({
        where,
        limit: 12,
        order: [
          ['createdAt', 'DESC'],
          [Comment, 'createdAt', 'DESC'],
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'avatar'],
          },
          {
            model: Image,
          },
          {
            model: Comment,
            attributes: [],
          },
          {
            model: Hashtag,
            attributes: ['name'],
            where: tag ? { name: decodeURI(tag) } : null,
            required: !!tag,
          },
        ],
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
