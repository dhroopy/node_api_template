const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1',
  version: 'latest',
});

module.exports = s3;
