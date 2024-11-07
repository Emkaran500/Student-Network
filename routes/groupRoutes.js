const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticateToken = require('../middlewares/authenticateToken')


router.post('/group', authenticateToken, groupController.createGroup);

router.get('/group', authenticateToken, groupController.getAllGroups);

router.get('/group/:id', authenticateToken, groupController.getGroupById);

router.put('/group/:id', authenticateToken, groupController.updateGroup);

router.delete('/group/:id', authenticateToken, groupController.deleteGroup);

module.exports = router;