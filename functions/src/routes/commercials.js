const express = require('express');
const commercialController = require('../controllers/commercials');
const { filesUpload } = require('../middlewares/fileUpload');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', FBauth, filesUpload, commercialController.create);
router.get('/', FBauth, commercialController.getAll);
router.get('/:id', FBauth, commercialController.getOne);
router.put('/:id', FBauth, filesUpload, commercialController.update);
router.delete('/:id', FBauth, commercialController.delete);

module.exports = router;
