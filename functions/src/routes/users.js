const express = require('express');
const userController = require('../controllers/users');
const { FBauth } = require('../middlewares/auth');
const { filesUpload } = require('../middlewares/fileUpload');

const router = express.Router();

router.post('/signup', userController.signupUser);
router.post('/signin', userController.signinUser);
router.post('/uploadAvatar', FBauth, filesUpload, userController.uploadAvatar);

module.exports = router;
