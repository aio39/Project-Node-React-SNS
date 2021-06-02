/* eslint-disable import/order */
const forest = require('forest-express-sequelize');

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const redis = require('redis');

const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();

const app = express();

passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(
    '^(?!forest/?$).*',
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

const RedisStore = require('connect-redis')(session);
// express-session에 의존적.
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new RedisStore({ client: redisClient }),
  }),
);

//  for PassPort
app.use(passport.initialize()); // login , logout 메소드
app.use(passport.session()); // session 데이터를 req.user로

app.get('/', (req, res) => {
  res.send('hello express');
});

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const debugRouter = require('./routes/debug');

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);
app.use('/debug', debugRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.json(res.locals.message);
});

process.on('uncaughtException', err => {
  console.log(`😱uncaughtException${err}`);
});

async function assertDBConnection() {
  console.log('➡️ Checking DB connection');
  try {
    await db.sequelize.sync({ alter: false, force: false });
    console.log('✔️ DB connected');
  } catch (error) {
    console.error(error);
    console.log('❌ Unable to connect to the database:');
    process.exit(1);
  }
}

let server;
async function init() {
  await assertDBConnection();

  app.set('port', process.env.PORT || 3005);
  server = await app.listen(app.get('port'), () => {
    console.log(`✔️ ${app.get('port')}번 포트에서 대기중`);
    // app.use(
    //   async () =>
    //     await forest.init({
    //       envSecret: process.env.FOREST_ENV_SECRET,
    //       authSecret: process.env.FOREST_AUTH_SECRET,
    //       objectMapping: db.Sequelize,
    //       connections: { default: db.sequelize },
    //     }),
    // );
  });
}

init();

const shutDown = async () => {
  console.log('Received kill signal, shutting down gracefully');
  await db.sequelize.close();
  console.log('DB Connection Closed');
  server.close();
  console.log('Express Server Closed');
};
process.once('SIGHUP', shutDown);
