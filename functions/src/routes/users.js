const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

router.get('/ping', userController.ping);
router.post('/signup', userController.signupUser);

module.exports = router;
