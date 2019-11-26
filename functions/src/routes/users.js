const express = require('express');
const userController = require('../controllers/users');
const { FBauth } = require('../middlewares/auth');

const router = express.Router();

router.get('/ping', userController.ping);
router.post('/signup', userController.signupUser);

module.exports = router;
