const express = require('express');
const commercialController = require('../controllers/commercials');
const upload = require('../utils/multerConfig');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', FBauth, upload.any(), commercialController.create);

module.exports = router;
