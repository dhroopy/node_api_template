//require libraries
const router = require('express-promise-router')();
const Test = require('../controllers/test');
const { validation } = require('../helper/validation');
const { testSchemas } = require('../models/test/testSchemas');

const passport = require('passport');

//require passport configuration
require('../helper/passport');

//require multer config for file upload
const upload = require('../helper/multer');

//passport methods
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false }); //will be used to authenticate
// const passportAdmin = passport.authenticate('admin', { session: false });
/**
 * @swagger
 * /test/username:
 *  post:
 *    summary: Test api end point currently configured to fetch user by username
 *    tags:
 *      - Tests
 *    parameters:
 *      - name: username
 *        in: formData
 *        description: username in database->user_master table
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: Username Not Found
 *      '500':
 *        description: Server Error
 */
router
  .route('/username')
  .post(validation(testSchemas.userSchema), Test.testController);

/**
 * @swagger
 * /test/swagger:
 *  get:
 *    summary: Testing swagger
 *    tags:
 *      - Tests
 *    parameters:
 *      - name: username
 *        in: formData
 *        description: username in database->user_master table
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: password
 *        in: formData
 *        description: Users password
 *    responses:
 *      '200':
 *        description: OK
 */
router.route('/swagger').get((req, res) => {
  console.log('req.originalUrl :>> ', req.originalUrl);
  res.status(200).json('SWAGGER WORKING');
});
/**
 * @swagger
 * /test/signIn:
 *  post:
 *    summary: sig in example
 *    tags:
 *      - USER
 *    parameters:
 *      - name: username
 *        in: formData
 *        description: username in database->user_master table
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: password
 *        in: formData
 *        description: Users password
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: OK
 */
router
  .route('/signIn')
  .post(validation(testSchemas.signInSchema), passportSignIn, Test.signIn);

router.route('/fetchCompany').post(Test.fetchCompanyById);

/**
 * @swagger
 * /test/upload:
 *  post:
 *    summary: Uploading file to aws
 *    tags:
 *      - Tests
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - name: imagename
 *        in: formData
 *        description: The uploaded file data
 *        required: true
 *        type: file
 *    responses:
 *      '200':
 *        description: OK
 *      '400':
 *        description: Bad Request
 *      '500':
 *        description: Server Error
 */
router.route('/upload').post(upload.single('imagename'), Test.imageUploadTest);
router.route('/imageGetTest').post(Test.imageGetTest);

router.route('/secret').post(passportJWT, (req, res) => {
  res.status(200).json(`Successfully fetching secret api for req ${req.body}`);
});

//export module
module.exports = router;
