const express = require('express');
const locationController = require('../controllers/locations');

const router = express.Router();

router.post('/', locationController.create);
router.get('/', locationController.getAll);
router.get('/:id', locationController.getOne);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
