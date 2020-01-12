const express = require('express');
const tickets = require('../controllers/tickets');
const { FBauth, isSuperAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', FBauth, tickets.create);
router.post('/:id', FBauth, tickets.addMessage);
router.get('/:status', FBauth, tickets.getByStatus);
router.get('/:id', FBauth, tickets.getOne);
router.patch('/:id', FBauth, isSuperAdmin, tickets.markAsResolved);
router.get('/', FBauth, tickets.getAll);
module.exports = router;
