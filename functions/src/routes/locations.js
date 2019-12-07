const express = require('express');
const locationController = require('../controllers/locations');
const { FBauth } = require('../middlewares/auth');
const { filesUpload } = require('../middlewares/fileUpload');

const router = express.Router();

router.post('/', FBauth, filesUpload, locationController.create);
router.get('/', FBauth, locationController.getAll);
router.get('/:id', FBauth, locationController.getOne);
router.put('/:id', FBauth, locationController.updateLocation);
router.delete('/:id', FBauth, locationController.deleteLocation);

module.exports = router;
