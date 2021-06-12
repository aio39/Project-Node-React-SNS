const express = require('express');
const { promises: fs } = require('fs');
const path = require('path');

const dbLogPath = path.join('./', `/log/db`);
const reqLogPath = path.join('./', `/log/req`);

const logRouter = express.Router();

const returnDBLogs = async (req, res) => {
  const files = await fs.readdir(dbLogPath);
  res.status(200).json(files);
};

const returnReqLogs = async (req, res) => {
  const files = await fs.readdir(reqLogPath);
  res.status(200).json(files);
};

logRouter.use(express.static('log'));

logRouter.all('/db', returnDBLogs);
logRouter.all('/req', returnReqLogs);

module.exports = logRouter;
