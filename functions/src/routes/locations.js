const express = require('express');
const locationController = require('../controllers/locations');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');
const { filesUpload } = require('../middlewares/fileUpload');

const router = express.Router();

router.post('/', FBauth, isSuperAdmin, filesUpload, locationController.create);
router.get('/', FBauth, locationController.getAll);
router.get('/:id', FBauth, locationController.getOne);
router.put('/:id', FBauth, isSuperAdmin, filesUpload, locationController.updateLocation);
router.delete('/:id', FBauth, isSuperAdmin, locationController.deleteLocation);

module.exports = router;
