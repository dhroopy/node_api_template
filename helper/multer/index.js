//Require Multer -> Handles multipart-form-data
const multer = require('multer');
const { extname } = require('path');

const memoryStorage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        '-' +
        datetimestamp +
        '.' +
        file.originalname.split('.')[file.originalname.split('.').length - 1],
    );
  },
});

const upload = multer({
  //multer settings
  storage: memoryStorage,
  fileFilter: function (req, file, callback) {
    // Allowing only images
    var ext = extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1, // Limiting file size to 1 MB
  },
});

module.exports = upload;
