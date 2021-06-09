require('dotenv').config();

module.exports = {
  images: {
    domains: ['source.unsplash.com'],
  },
  env: {
    PROD_HOST: process.env.PROD_HOST,
    DEV_HOST: process.env.DEV_HOST,
  },
  future: {
    webpack5: true,
  },
};
