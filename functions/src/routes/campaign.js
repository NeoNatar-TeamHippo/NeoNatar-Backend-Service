const express = require('express');
const campaign = require('../controllers/campaign');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', FBauth, campaign.create);
router.get('/', FBauth, campaign.getAll);
router.get('/:id', FBauth, campaign.getOne);
router.get('/', FBauth, isSuperAdmin, campaign.adminGetAll);
router.get('/:id', FBauth, isSuperAdmin, campaign.adminGetOne);
router.put('/:id', FBauth, campaign.updateCampaign);
router.put('/:id/approved', FBauth, isSuperAdmin, campaign.updateCampaign);
router.delete('/:id', FBauth, campaign.deleteCampaign);

module.exports = router;
