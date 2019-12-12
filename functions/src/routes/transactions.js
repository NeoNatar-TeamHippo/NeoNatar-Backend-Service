const express = require('express');
const transactions = require('../controllers/transactions');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', FBauth, transactions.create);
router.get('/', FBauth, transactions.getAll);
router.get('/:id', FBauth, transactions.getOne);
router.patch('/:id', FBauth, isSuperAdmin, transactions.markAsInvalid);
module.exports = router;
