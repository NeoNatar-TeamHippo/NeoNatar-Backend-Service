const express = require('express');
const campaign = require('../controllers/campaign');
const { FBauth } = require('../middlewares/auth');

const router = express.Router();

router.post('/', FBauth, campaign.create);
router.get('/', FBauth, campaign.getAll);
router.get('/:id', FBauth, campaign.getOne);
router.put('/:id', FBauth, campaign.updateSavedLocation);
router.delete('/:id', FBauth, campaign.deleteSavedLocation);

module.exports = router;
