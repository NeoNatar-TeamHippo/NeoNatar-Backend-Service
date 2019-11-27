const express = require('express');
const locationController = require('../controllers/locations');

const router = express.Router();

router.post('/location', locationController.create);
router.get('/locations', locationController.getAll);
router.get('/locations/:id', locationController.getOne);
router.put('/locations/:id', locationController.updateLocation);
router.delete('/locations/:id', locationController.deleteLocation);

module.exports = router;
