const express = require('express');
const { Op } = require('sequelize');
const Comment = require('../models/comment');
const Hashtag = require('../models/hashtag');
const Image = require('../models/image');
const Post = require('../models/post');
const User = require('../models/user');

const hashtagRouter = express.Router();

//  NOTE post를 기준으로 쿼리 하는 것은, where절 필터링 후 나머지 태그들을 포함 시키기 실패
//  NOTE  hashtag를 기준으로 쿼리하고 include내에서 limit를 주면 에러가 발생

hashtagRouter.get('/:hashtag', async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const hashtag = await Hashtag.findOne({
      where: {
        name: decodeURIComponent(req.params.hashtag),
      },
    });
    console.log(hashtag);
    const posts = await hashtag.getPosts({
      where,
      order: [['createdAt', 'DESC']],
      limit: 12,
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar'] },
        { model: Hashtag },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = hashtagRouter;
