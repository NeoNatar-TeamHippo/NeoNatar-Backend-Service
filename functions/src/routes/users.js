const express = require('express');
const userController = require('../controllers/users');
const { FBauth } = require('../middlewares/auth');
const { filesUpload } = require('../middlewares/fileUpload');

const router = express.Router();

router.post('/signup', userController.signupUser);
router.post('/signin', userController.signinUser);
router.patch('/uploadAvatar', FBauth, filesUpload, userController.uploadAvatar);
router.get('/', FBauth, userController.viewProfile);
router.put('/', FBauth, userController.updateProfile);
router.get('/logout', FBauth, userController.logoutUser);

module.exports = router;
