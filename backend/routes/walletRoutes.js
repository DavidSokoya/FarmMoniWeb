const express = require('express');
const router = express.Router();
const { getMyWallet, depositFunds, verifyDeposit } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// protected ROUTES
router.get('/', protect, getMyWallet);
router.post('/deposit', protect, depositFunds);
router.post('/verify', protect, verifyDeposit);

module.exports = router;