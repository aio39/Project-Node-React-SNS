const express = require('express');
const postRouter = require('./post');
const postsRouter = require('./posts');
const userRouter = require('./user');
const hashtagRouter = require('./hashtag');
const debugRouter = require('./debug');

const apiRouter = express.Router();

apiRouter.use('/posts', postsRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/hashtag', hashtagRouter);
apiRouter.use('/debug', debugRouter);

module.exports = apiRouter;
