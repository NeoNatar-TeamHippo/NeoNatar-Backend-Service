const express = require('express');
const campaign = require('../controllers/campaign');
const { FBauth } = require('../middlewares/auth');

const router = express.Router();

router.post('/', FBauth, campaign.create);
// router.get('/', FBauth, savedLocationController.getAll);
// router.get('/:id', FBauth, savedLocationController.getOne);
// router.put('/:id', FBauth, savedLocationController.updateSavedLocation);
// router.delete('/:id', FBauth, savedLocationController.deleteSavedLocation);

module.exports = router;
