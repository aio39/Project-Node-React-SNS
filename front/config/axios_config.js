const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://aio392.com'
    : 'http://localhost:3005';

export default backUrl;
