const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');
const authenticateToken = require('../middlewares/authenticateToken')

router.post('/homework', authenticateToken, homeworkController.createHomework);

router.get('/homework/group/:group_id', authenticateToken, homeworkController.getHomeworksByGroupId);

router.get('/homework/:id', authenticateToken, homeworkController.getHomeworkById);

router.put('/homework/grade/:id', authenticateToken, homeworkController.giveGradeToHomework);

router.delete('/homework/:id', authenticateToken, homeworkController.deleteHomework);

module.exports = router;