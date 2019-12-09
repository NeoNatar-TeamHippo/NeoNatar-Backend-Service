const express = require('express');
const notificationController = require('../controllers/notifications');
const { FBauth } = require('../middlewares/auth');
const router = express.Router();

router.get('/', FBauth, notificationController.allNotifications);
router.post('/', FBauth, notificationController.markAsRead);
module.exports = router;
