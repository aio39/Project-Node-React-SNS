const express = require('express');
const { getPosts } = require('../controllers/post');

const postsRouter = express.Router();

postsRouter.get('/', getPosts);

module.exports = postsRouter;
