const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User } = require('../models');
const { isNotLoggedIn, isLoggedIn } = require('../utils/checkLoginMiddleware');
const { avatarImageUpload } = require('../utils/multer');

const userRouter = express.Router();

userRouter.post('/login', isNotLoggedIn, (req, res, next) => {
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
});

userRouter.get('/', (req, res) => {
  console.log(req.user);
  return res.json(req.user || false);
});

userRouter.post('/', isNotLoggedIn, async (req, res, next) => {
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
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

userRouter.get('/userId');
userRouter.get('/userId/posts');

userRouter.post('/avatar', avatarImageUpload.single('image'), (req, res) => {
  console.log(req.file);
  const image = req.file.location;
  if (image === undefined) {
    return res.status(400).send('이미지가 존재하지 않습니다.');
  }
  return res.status(200).json(image);
});

userRouter.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

module.exports = userRouter;
