const express = require('express');
const { Op } = require('sequelize');
const { Comment, sequelize, Post, Hashtag } = require('../models');

const router = express.Router();

router.get('/groups', async (req, res) => {
  const result = await Comment.findAll({
    attributes: [
      'PostId',
      [sequelize.fn('COUNT', sequelize.col('PostId')), 'count'],
    ],
    group: ['Comment.PostId'],
  });

  res.json(result);
});

router.get('/tagsearch', async (req, res) => {
  console.log(req.query.tag);
  const result = await Hashtag.findAll({
    attributes: ['id', 'name'],
    where: {
      name: {
        [Op.like]: `%${decodeURI(req.query.tag)}%`,
      },
    },
  });

  const map = await Promise.all(
    result.map(async tag => {
      const a = 0;
      return 'OK';
    }),
  );
  console.log(result);
  res.json(result);
});

router.get('/count', async (req, res) => {
  const result = await Post.findAll({
    attributes: [
      'Post.*',
      'comments.*',
      [sequelize.fn('COUNT', sequelize.col('comments.id')), 'count'],
    ],
    include: [Comment],
  });

  res.json(result);
});

router.all('/', (req, res) => {
  res.json({
    'req.session': req.session, // 세션 데이터
    'req.user': req.user, // 유저 데이터(뒷 부분에서 설명)
    'req._passport': req._passport, // 패스포트 데이터(뒷 부분에서 설명)
  });
});

module.exports = router;
