const express = require('express');
const locationController = require('../controllers/locations');
const { checkIfAdmin, checkIfAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post('/', checkIfAuthenticated, locationController.create);
router.get('/', checkIfAuthenticated, locationController.getAll);
router.get('/:id', checkIfAuthenticated, locationController.getOne);
router.put('/:id', checkIfAuthenticated, locationController.updateLocation);
router.delete('/:id', checkIfAuthenticated, locationController.deleteLocation);

module.exports = router;
