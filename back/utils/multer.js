//  for uploading Image to AWS S3
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'ap-northeast-2',
  },
});

const s3PostImageUploader = multerS3({
  s3,
  bucket: '2021-node-project/postImage',
  acl: 'public-read',
  key(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname.split('.').pop()}`);
  },
});

const s3UserAvatarUploader = multerS3({
  s3,
  bucket: '2021-node-project/avatars',
  acl: 'public-read',
  key(req, file, cb) {
    cb(null, `originial/${Date.now()}.${file.originalname.split('.').pop()}`);
  },
});

module.exports = {
  postImageUpload: multer({
    // dest: 'uploads/postImage/',
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    storage: s3PostImageUploader,
  }),
  avatarImageUpload: multer({
    // dest: 'uploads/avatars/',
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    storage: s3UserAvatarUploader,
  }),
};
