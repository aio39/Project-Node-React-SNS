const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
require('dotenv').config();

const date = dayjs().format('YYYY[_]MM[_]DD');
const time = dayjs().format('H:mm:ss');

const logPath = path.join('./', `/log/req`);

if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, { recursive: true });

console.log(`📂Request Log File : ./log/req`);

const log = fs.createWriteStream(`${logPath}/${date}.log`, { flags: 'a' });
log.write(`\n\n[${time}]\n`);

const ipSet = new Set();

const morganAndCorsConfig = app => {
  if (process.env.NODE_ENV === 'production') {
    app.use(
      morgan('combined', {
        stream: log,
        skip: (req, res) => {
          if (ipSet.has(req.ip)) {
            return true;
          }
          ipSet.add(req.ip);
          return false;
        },
      }),
    );
    app.use(
      '^(?!forest/?$).*',
      cors({
        origin: process.env.APPLICATION_URL,
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
};

module.exports = morganAndCorsConfig;
