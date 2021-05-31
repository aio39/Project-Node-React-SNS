const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  //  로그인에 성공하면 serializeUser 유저를 실행하며 세션 key를 만듬
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //  passport.session() 이  req.session의 데이터를 분석해서 req.user로 넣어줌.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ['password'] },
      });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
