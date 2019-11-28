const express = require('express');
const staffController = require('../controllers/staffs');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');
const router = express.Router();

router.get('/', FBauth, isSuperAdmin, staffController.allStaffs);
router.post('/', FBauth, isSuperAdmin, staffController.create);
router.get('/:id', FBauth, isSuperAdmin, staffController.getOne);
router.patch('/:id', FBauth, isSuperAdmin, staffController.activateOrDeactivateStaff);

module.exports = router;
