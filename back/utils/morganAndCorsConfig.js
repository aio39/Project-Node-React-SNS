const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const morganAndCorsConfig = app => {
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
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
