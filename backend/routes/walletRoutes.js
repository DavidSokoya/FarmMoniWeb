const express = require('express');
const router = express.Router();
const { getMyWallet, depositFunds, verifyDeposit, getTransactions, requestWithdrawal, getBankList, resolveBankAccount} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// protected ROUTES
router.get('/', protect, getMyWallet);
router.get('/banks', protect, getBankList);
router.get('/transactions', protect, getTransactions)
router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, requestWithdrawal)
router.post('/verify', protect, verifyDeposit);
router.post('/resolve-account', protect, resolveBankAccount);


module.exports = router;