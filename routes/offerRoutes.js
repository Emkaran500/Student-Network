const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authenticateToken = require('../middlewares/authenticateToken')


router.post('/offer', authenticateToken, offerController.createOffer);

router.get('/offer', authenticateToken, offerController.getAllOffers);

router.get('/offer/:id', authenticateToken, offerController.getOfferById);

router.put('/offer/:id', authenticateToken, offerController.updateOffer);

router.delete('/offer/:id', authenticateToken, offerController.deleteOffer);

router.put('/offer/user/:id', authenticateToken, offerController.addUserToOffer)

router.put('/offer/status/:id', authenticateToken, offerController.changeStatusOfOffer)

module.exports = router;