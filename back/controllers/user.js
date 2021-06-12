const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post, Image } = require('../models');

module.exports = {
  postUserLogin: (req, res, next) => {
    //  local 전략을 실행하고 로컬 전략의 return값을 넘겨줌.
    //  local 전략은 동시에 쿠키를 심어줌.
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async loginErr => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        const fullUserWithoutPassword = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ['password'],
          },
        });
        return res.status(200).json(fullUserWithoutPassword);
      });
    })(req, res, next);
  },
  postUser: async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
      const exUser = await User.findOne({
        where: {
          email,
        },
      });
      if (exUser) {
        return res.status(403).send('이미 사용 중인 아이디입니다.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nickname,
        password: hashedPassword,
      });
      return res.status(201).send('ok');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  patchUser: async (req, res, next) => {
    const { oldPassword, newPassword, nickname, description } = req.body;
    const { id } = req.user;
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return res.status(403).send('아이디가 존재하지 않습니다.');
      }

      if (oldPassword && newPassword) {
        const isSamePassword = await bcrypt.compare(oldPassword, user.password);
        if (!isSamePassword)
          return res.status(403).send('Password가 일치하지 않습니다.');
        user.password = await bcrypt.hash(newPassword, 12);
      }

      if (nickname) user.nickname = nickname;
      if (description) user.description = description;

      await user.save();
      return res.status(201).send('ok');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  postAvatar: async (req, res) => {
    const imageURL = req.file.location;
    if (imageURL === undefined) {
      return res.status(400).send('이미지가 존재하지 않습니다.');
    }
    await User.update({ avatar: imageURL }, { where: { id: req.user.id } });
    return res.status(200).json(imageURL);
  },
  postLogout: (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.send('ok');
  },
  getUserPosts: async (req, res, next) => {
    try {
      const { id: UserId } = req.user;
      const where = {
        UserId,
      };
      if (parseInt(req.query.lastId, 10)) {
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      }
      const posts = await Post.findAll({
        where,
        limit: 6,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['nickname', 'avatar'],
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getUserBookmark: async (req, res, next) => {
    try {
      const { id: UserId } = req.user;
      const where = {};
      if (parseInt(req.query.lastId, 10)) {
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      }

      const posts = await Post.findAll({
        where,
        limit: 6,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['nickname', 'avatar'],
          },
          {
            model: User,
            as: 'Marker',
            where: {
              id: UserId,
            },
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(posts);
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
      return next(error);
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
      return next(error);
    }
  },
};
